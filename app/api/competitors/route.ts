import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const MODEL = "claude-sonnet-4-5";

type BusinessType = "restaurant" | "retail" | "service";

type UserItem = {
  name: string;
  price: number;
};

type CompetitorItem = {
  itemName: string;
  competitorPrice: number;
  userPrice: number | null;
  priceDifference: number | null;
  comparison: "lower" | "higher" | "similar" | "unknown";
};

type Competitor = {
  name: string;
  items: CompetitorItem[];
};

const BUSINESS_TYPES: BusinessType[] = ["restaurant", "retail", "service"];

function isBusinessType(x: unknown): x is BusinessType {
  return typeof x === "string" && BUSINESS_TYPES.includes(x as BusinessType);
}

function isUserItem(x: unknown): x is UserItem {
  if (x === null || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.name === "string" && o.name.trim().length > 0 && typeof o.price === "number" && o.price >= 0;
}

function extractJsonObject(text: string): string {
  const trimmed = text.trim();
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/im);
  if (fence?.[1]) return fence[1].trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end > start) return trimmed.slice(start, end + 1);
  return trimmed;
}

function normalizeCompetitors(raw: unknown): Competitor[] | null {
  if (raw === null || typeof raw !== "object") return null;
  const list = (raw as { competitors?: unknown }).competitors;
  if (!Array.isArray(list) || list.length === 0) return null;

  const out: Competitor[] = [];
  for (const c of list) {
    if (c === null || typeof c !== "object") continue;
    const row = c as Record<string, unknown>;
    if (typeof row.name !== "string" || !row.name.trim()) continue;
    if (!Array.isArray(row.items)) continue;

    const items: CompetitorItem[] = [];
    for (const item of row.items) {
      if (item === null || typeof item !== "object") continue;
      const i = item as Record<string, unknown>;
      if (typeof i.itemName !== "string") continue;
      if (typeof i.competitorPrice !== "number" || !Number.isFinite(i.competitorPrice)) continue;

      const userPrice =
        typeof i.userPrice === "number" && Number.isFinite(i.userPrice) ? i.userPrice : null;
      const priceDifference =
        typeof i.priceDifference === "number" && Number.isFinite(i.priceDifference)
          ? i.priceDifference
          : userPrice !== null
            ? i.competitorPrice - userPrice
            : null;
      const comparison = i.comparison;
      const validComparison =
        comparison === "lower" ||
        comparison === "higher" ||
        comparison === "similar" ||
        comparison === "unknown"
          ? comparison
          : "unknown";

      items.push({
        itemName: i.itemName,
        competitorPrice: i.competitorPrice,
        userPrice,
        priceDifference,
        comparison: validComparison,
      });
    }

    if (items.length > 0) {
      out.push({ name: row.name.trim(), items });
    }
  }

  return out.length > 0 ? out : null;
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const businessName = typeof o.businessName === "string" ? o.businessName.trim() : "";
  const businessType = o.businessType;
  const city = typeof o.city === "string" ? o.city.trim() : "";
  const state = typeof o.state === "string" ? o.state.trim() : "";
  const userItemsRaw = o.userItems;

  if (!businessName || !isBusinessType(businessType) || !city || !state) {
    return NextResponse.json(
      {
        error:
          "Required: businessName (string), businessType (restaurant|retail|service), city (string), state (string).",
      },
      { status: 400 },
    );
  }

  const userItems: UserItem[] = Array.isArray(userItemsRaw)
    ? userItemsRaw.filter(isUserItem).map((item) => ({ name: item.name.trim(), price: item.price }))
    : [];

  const anthropic = new Anthropic({ apiKey });
  const locationLabel = `${city}, ${state}`;
  const userItemsSection =
    userItems.length > 0
      ? `The user's menu / catalog items and prices (USD):\n${JSON.stringify(userItems, null, 2)}`
      : "The user did not provide specific item prices. Pick 3-4 representative items typical for this business type and note userPrice as null with comparison unknown.";

  let message;
  try {
    message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 8192,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
          max_uses: 8,
          user_location: {
            type: "approximate",
            city,
            region: state,
            country: "US",
          },
        },
      ],
      messages: [
        {
          role: "user",
          content: `You are a competitive pricing analyst for small businesses. Use web search to find 3-5 real local competitors near ${locationLabel} that are similar to "${businessName}" (type: ${businessType}). Exclude the user's own business if it appears in results.

For each competitor, find publicly listed prices for items comparable to the user's offerings (menus, price lists, Yelp, Google, delivery apps, etc.). Use realistic USD prices from your search; if exact match unavailable, use the closest comparable item and note that in itemName.

${userItemsSection}

Return ONLY valid JSON (no markdown) with this shape:
{
  "competitors": [
    {
      "name": "<competitor business name>",
      "items": [
        {
          "itemName": "<comparable item name>",
          "competitorPrice": <number USD>,
          "userPrice": <number or null>,
          "priceDifference": <competitorPrice minus userPrice, or null if no user price>,
          "comparison": "lower" | "higher" | "similar" | "unknown"
        }
      ]
    }
  ]
}

Rules:
- Include 3-5 competitors when possible.
- Each competitor should have 2-4 items aligned with the user's items (or typical ${businessType} items).
- comparison: "lower" if competitor is cheaper than user, "higher" if more expensive, "similar" if within ~5%, "unknown" if no user price.
- priceDifference = competitorPrice - userPrice (negative means competitor is cheaper).`,
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

  if (!text) {
    return NextResponse.json({ error: "No text response from model" }, { status: 502 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJsonObject(text));
  } catch {
    return NextResponse.json(
      { error: "Model returned non-JSON output", raw: text.slice(0, 2000) },
      { status: 502 },
    );
  }

  const competitors = normalizeCompetitors(parsed);
  if (!competitors) {
    return NextResponse.json(
      { error: "Model JSON did not match expected competitors shape", raw: parsed },
      { status: 502 },
    );
  }

  return NextResponse.json({ competitors });
}
