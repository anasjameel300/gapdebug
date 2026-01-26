import { NextRequest, NextResponse } from "next/server";
import { queryOpenRouter } from "@/lib/ai-client";

const MODEL_PROFESSOR = process.env.MODEL_PROFESSOR || "openai/gpt-oss-120b:free";

export async function POST(req: NextRequest) {
    try {
        const { profile, goal } = await req.json();

        if (!profile) {
            return NextResponse.json({ success: false, error: "Missing profile data" }, { status: 400 });
        }

        // 1. The Professor's Job: Strategic Analysis
        const systemPrompt = `
      You are a Senior Career Strategy AI. Your goal is to analyze a student's profile and generate a comprehensive learning roadmap to help them achieve their target goal.
      
      Return ONLY a valid JSON object with the following structure:
      {
        "gapAnalysis": {
            "score": number (0-100),
            "missingSkills": ["string"],
            "feedback": "string (concise analysis)"
        },
        "roadmap": [
            {
                "id": "week-1",
                "title": "string (Focus Area)",
                "description": "string (What to learn and why)",
                "duration": "1 week",
                "resources": ["string (Search terms for resources)"],
                "status": "pending"
            }
            // Generate 4-6 weeks
        ]
      }
    `;

        const userPrompt = `
      Analyize this candidate:
      Target Goal: ${goal || profile.role || "Software Engineer"}
      Current Skills: ${profile.skills.join(", ")}
      Experience: ${profile.yearsOfExperience} years
      Education: ${profile.university} (${profile.gradYear})
      
      Create a gap analysis and a 4-6 week fast-track roadmap to bridge the gap.
    `;

        // 2. Call AI
        const aiResponse = await queryOpenRouter(MODEL_PROFESSOR, systemPrompt, userPrompt, true);

        return NextResponse.json({
            success: true,
            data: aiResponse
        });

    } catch (error) {
        console.error("Roadmap Generation Error:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to generate roadmap" },
            { status: 500 }
        );
    }
}
