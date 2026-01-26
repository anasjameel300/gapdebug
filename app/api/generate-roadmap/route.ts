import { NextRequest, NextResponse } from "next/server";
import { queryOpenRouter } from "@/lib/ai-client";

// Using The Professor model for reliable analysis
const MODEL_PROFILER = process.env.MODEL_PROFESSOR || "openai/gpt-oss-120b:free";

export async function POST(req: NextRequest) {
    try {
        const { profile, goal } = await req.json();

        if (!profile || !goal) {
            return NextResponse.json({ success: false, error: "Missing profile or goal data" }, { status: 400 });
        }

        const systemPrompt = `
      You are an expert Career Coach and Technical Mentor. Your goal is to analyze a user's current skills and experience against their target career goal to generate a personalized learning roadmap.

      Return ONLY a valid JSON object with the following structure:
      {
        "skillGaps": ["string (List of specific technical skills the user is missing for this role)"],
        "recommendedSkills": ["string (List of high-value skills that would distinguish them)"],
        "roadmap": [
          {
            "id": "item-1",
            "title": "string (Phase Title, e.g., 'Foundation: Advanced React Patterns')",
            "description": "string (Actionable advice on what to learn and why)",
            "duration": "string (Estimated time, e.g., '2 weeks')",
            "status": "pending",
            "resources": ["string (Keywords for resources, e.g., 'React Docs', 'Epic React')"]
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

        const aiResponse = await queryOpenRouter(MODEL_PROFILER, systemPrompt, userPrompt, true);

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
