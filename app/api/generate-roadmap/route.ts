import { NextRequest, NextResponse } from "next/server";
import { queryOpenRouter } from "@/lib/ai-client";

// Using The Professor model for reliable analysis
const MODEL_PROFESSOR = process.env.MODEL_PROFESSOR || "openai/gpt-oss-120b:free";

export async function POST(req: NextRequest) {
  try {
    const { profile, goal } = await req.json();

    if (!profile || !goal) {
      return NextResponse.json({ success: false, error: "Missing profile or goal data" }, { status: 400 });
    }

    const systemPrompt = `
      You are an expert Career Coach. Analyze the user's skills and experience against their target goal to generate a personalized learning roadmap.

      Return ONLY a valid JSON object with the following structure:
      {
        "skillGaps": ["string (Specific technical skills missing)"],
        "recommendedSkills": ["string (High-value skills to distinguish them)"],
        "roadmap": [
          {
            "id": "week-1",
            "title": "string (Phase Title)",
            "description": "string (Actionable advice: what to learn and why)",
            "duration": "string (Estimated time)",
            "status": "pending",
            "resources": ["string (Search terms for resources)"]
          }
        ]
      }
    `;

    const userPrompt = `
      Create a roadmap for this candidate:
      Current Profile:
      - Role/Persona: ${profile.persona === 'student' ? profile.university + ' Student' : profile.role}
      - Years Exp: ${profile.yearsOfExperience || 0}
      - Current Skills: ${profile.skills.join(", ")}
      
      Target Goal: ${goal}
      
      Identify the gap between their current state and the target goal.
      Provide a step-by-step roadmap to bridge this gap.
      Keep it realistic and actionable.
    `;

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
