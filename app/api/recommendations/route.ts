import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const MODEL = "claude-sonnet-4-5";

type ProductInput = {
  id: string;
  name: string;
  currentPrice: number;
  /** Units sold in the last 7 days */
  unitsSoldLast7Days?: number;
  /** Revenue in USD for the last 7 days */
  revenueLast7Days?: number;
  /** Optional average daily units (if pre-computed) */
  avgDailyUnits?: number;
};

type RecommendationOutput = {
  id: string;
  itemName: string;
  currentPrice: number;
  suggestedPrice: number;
  expectedRevenueChange: number;
};

function isProductInput(x: unknown): x is ProductInput {
  if (x === null || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    o.id.length > 0 &&
    typeof o.name === "string" &&
    typeof o.currentPrice === "number" &&
    Number.isFinite(o.currentPrice)
  );
}

function extractJsonObject(text: string): string {
  const trimmed = text.trim();
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/im);
  if (fence?.[1]) return fence[1].trim();
  return trimmed;
}

function normalizeRecommendations(
  raw: unknown,
  products: ProductInput[],
): RecommendationOutput[] | null {
  if (raw === null || typeof raw !== "object") return null;
  const recs = (raw as { recommendations?: unknown }).recommendations;
  if (!Array.isArray(recs)) return null;

  const byId = new Map(products.map((p) => [p.id, p]));

  const out: RecommendationOutput[] = [];
  for (const item of recs) {
    if (item === null || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    const id = r.id;
    const itemName = r.itemName;
    const currentPrice = r.currentPrice;
    const suggestedPrice = r.suggestedPrice;
    const expectedRevenueChange = r.expectedRevenueChange;

    if (typeof id !== "string" || !byId.has(id)) continue;
    if (typeof itemName !== "string") continue;
    if (typeof currentPrice !== "number" || !Number.isFinite(currentPrice)) continue;
    if (typeof suggestedPrice !== "number" || !Number.isFinite(suggestedPrice)) continue;
    if (typeof expectedRevenueChange !== "number" || !Number.isFinite(expectedRevenueChange))
      continue;

    out.push({
      id,
      itemName,
      currentPrice,
      suggestedPrice,
      expectedRevenueChange,
    });
  }

  if (out.length !== products.length) return null;
  return out;
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const productsUnknown = (body as { products?: unknown })?.products;
  if (!Array.isArray(productsUnknown) || productsUnknown.length === 0) {
    return NextResponse.json(
      { error: "Request must include a non-empty products array" },
      { status: 400 },
    );
  }

  const products = productsUnknown.filter(isProductInput);
  if (products.length !== productsUnknown.length) {
    return NextResponse.json(
      {
        error:
          "Each product must have id (string), name (string), and currentPrice (number). Optional: unitsSoldLast7Days, revenueLast7Days, avgDailyUnits.",
      },
      { status: 400 },
    );
  }

  const anthropic = new Anthropic({ apiKey });

  const userPayload = JSON.stringify(products, null, 2);

  let message;
  try {
    message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `You are a pricing analyst for small restaurants and retail SMBs. Given each product's current price and sales data, propose a single suggested price and estimate the expected change in daily revenue in USD (positive if you expect net uplift, negative if you expect net decline).

Rules:
- suggestedPrice must be a realistic number (two decimal places mentally OK; output as JSON numbers).
- expectedRevenueChange is your best single estimate of extra (or lost) revenue per day vs keeping currentPrice, in USD.
- Include one row per input product; use the same id and keep itemName aligned with the input name.

Return ONLY valid JSON with this exact shape (no markdown, no commentary):
{
  "recommendations": [
    {
      "id": "<string, must match input id>",
      "itemName": "<string>",
      "currentPrice": <number>,
      "suggestedPrice": <number>,
      "expectedRevenueChange": <number>
    }
  ]
}

Products (JSON):
${userPayload}`,
        },
      ],
    });
  } catch (err) {
    const messageText = err instanceof Error ? err.message : "Anthropic request failed";
    return NextResponse.json({ error: messageText }, { status: 502 });
  }

  const text = message.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJsonObject(text));
  } catch {
    return NextResponse.json(
      { error: "Model returned non-JSON output", raw: text.slice(0, 2000) },
      { status: 502 },
    );
  }

  const recommendations = normalizeRecommendations(parsed, products);
  if (!recommendations) {
    return NextResponse.json(
      { error: "Model JSON did not match expected recommendations shape or count", raw: parsed },
      { status: 502 },
    );
  }

  return NextResponse.json({ recommendations });
}
