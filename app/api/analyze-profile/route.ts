import { NextRequest, NextResponse } from "next/server";
import { queryOpenRouter } from "@/lib/ai-client";

// Using The Professor model for reliable analysis
const MODEL_PROFILER = process.env.MODEL_PROFESSOR || "openai/gpt-oss-120b:free";

export async function POST(req: NextRequest) {
    try {
        const { profile } = await req.json();

        if (!profile) {
            return NextResponse.json({ success: false, error: "Missing profile data" }, { status: 400 });
        }

        // 1. The Profiler's Job: Identity Inference & Professional Summary
        const systemPrompt = `
      You are an expert Career Profiler. Your goal is to analyze a user's raw profile data to infer their real identity, clean up their achievements, and generate a professional summary.
      
      Return ONLY a valid JSON object with the following structure:
      {
        "name": "string (inferred Real Name)",
        "university": "string (Corrected spelling, capitalization, and formatting e.g. 'Centurion University, Odisha')",
        "role": "string (Corrected title)",
        "achievements": "string (cleaned up, bulleted list of key achievements)",
        "analysis": {
            "summary": "string (2-3 sentences professional summary of the candidate)",
            "verification": {
                "verified": ["string (e.g., 'GitHub Activity', 'Valid LinkedIn URL')"],
                "unverified": ["string (e.g., 'University Transcript', 'Work Experience')"]
            }
        }
      }
    `;

        const userPrompt = `
      Analyze this candidate profile:
      Persona: ${profile.persona}
      University/Role: ${profile.university || profile.role}
      Skills: ${profile.skills.join(", ")}
      Socials: GitHub: ${profile.socials.github || "N/A"}, LinkedIn: ${profile.socials.linkedin || "N/A"}
      Raw Achievements/Resume Data: ${profile.achievements || "None provided"}
      
      Infer their likely real name from the social handles if possible. 
      Format the achievements professionally.
      Generate a concise professional summary.
    `;

        // 2. Call AI
        const aiResponse = await queryOpenRouter(MODEL_PROFILER, systemPrompt, userPrompt, true);

        return NextResponse.json({
            success: true,
            data: aiResponse
        });

    } catch (error) {
        console.error("Profile Analysis Error:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to analyze profile" },
            { status: 500 }
        );
    }
}
