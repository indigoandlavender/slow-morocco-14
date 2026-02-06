import { NextResponse } from "next/server";
import { getChatbotTraining } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const rows = await getChatbotTraining();

    const training = rows.map((row) => ({
      category: row.category || "",
      question: row.question || "",
      answer: row.answer || "",
      keywords: row.keywords
        ? row.keywords.split(",").map((k: string) => k.trim().toLowerCase())
        : [],
      order: row.sort_order || 0,
    }));

    return NextResponse.json({ training });
  } catch (error) {
    console.error("Error fetching chatbot training:", error);
    return NextResponse.json(
      { error: "Failed to fetch chatbot training" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const rows = await getChatbotTraining();
    const normalizedMessage = message.toLowerCase().trim();

    let bestMatch: typeof rows[0] | null = null;
    let bestScore = 0;

    for (const row of rows) {
      const keywords = row.keywords
        ? row.keywords.split(",").map((k: string) => k.trim().toLowerCase())
        : [];

      for (const keyword of keywords) {
        if (keyword && normalizedMessage.includes(keyword)) {
          const score = keyword.length;
          if (score > bestScore) {
            bestScore = score;
            bestMatch = row;
          }
        }
      }
    }

    if (!bestMatch) {
      bestMatch = rows.find((r) => r.category === "fallback") || null;
    }

    const response = bestMatch?.answer || "I'm not sure how to help with that. Please email us at hello@slowmorocco.com";

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error processing chatbot message:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
