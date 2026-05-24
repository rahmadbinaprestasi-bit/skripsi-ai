import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { stage1Logic, stage2Restructure, stage3Humanize } from "@/lib/gemini";

const MAX_WORDS_PER_REQUEST = 1500;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, plan, word_quota")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check quota for non-unlimited plans
    if (profile.plan !== "unlimited" && profile.word_quota <= 0) {
      return NextResponse.json(
        { error: "Kuota kata habis. Upgrade paket Anda." },
        { status: 403 }
      );
    }

    const { prompt, module, context } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Execute the 3-stage anti-detection pipeline
    // Stage 1: Logic extraction
    const points = await stage1Logic(context || {}, prompt);

    // Stage 2: Restructure
    const draft = await stage2Restructure(points, context || {});

    // Stage 3: Humanize
    const finalText = await stage3Humanize(draft, context || {});

    // Calculate word count (limited to MAX_WORDS_PER_REQUEST)
    const words = finalText.split(/\s+/).filter(Boolean);
    const wordCount = Math.min(words.length, MAX_WORDS_PER_REQUEST);
    const truncatedText = words.slice(0, MAX_WORDS_PER_REQUEST).join(" ");

    // Update user quota (skip for unlimited plans)
    if (profile.plan !== "unlimited") {
      await supabase
        .from("profiles")
        .update({
          word_quota: profile.word_quota - wordCount,
          word_used: (await supabase.from("profiles").select("word_used").eq("id", user.id).single()).data?.word_used + wordCount,
        })
        .eq("id", user.id);
    }

    // Log the generation activity
    await supabase.from("generate_logs").insert({
      user_id: user.id,
      module: module || "writer",
      prompt: prompt.substring(0, 500), // Truncate for storage
      word_count: wordCount,
      model_used: process.env.GEMINI_MODEL || "gemini-1.5-pro",
    });

    return NextResponse.json({
      content: truncatedText,
      wordsUsed: wordCount,
      totalWords: words.length,
    });
  } catch (error) {
    const err = error as { message?: string };
    console.error("Generate API Error:", error);
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan saat generate" },
      { status: 500 }
    );
  }
}