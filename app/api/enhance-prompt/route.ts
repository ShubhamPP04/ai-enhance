import { NextRequest, NextResponse } from "next/server";
import { enhancePrompt } from "@/lib/gemini";

export const maxDuration = 60; // Set max duration to 60 seconds for longer processing

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const enhancedPrompt = await enhancePrompt(prompt);

    return NextResponse.json({ enhancedPrompt });
  } catch (error) {
    console.error("Error in enhance-prompt API route:", error);
    return NextResponse.json(
      { error: "Failed to enhance prompt" },
      { status: 500 }
    );
  }
}
