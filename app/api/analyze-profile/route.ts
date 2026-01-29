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
      You are an expert Career Profiler. Analyze the user's raw profile data to infer their real identity, clean up their achievements, and generate a professional summary.
      
      Return ONLY a valid JSON object with the following structure:
      {
        "name": "string (Inferred Real Name)",
        "university": "string (Corrected spelling/formatting)",
        "role": "string (Corrected title)",
        "achievements": "string (Cleaned up, bulleted list)",
        "analysis": {
            "summary": "string (2-3 sentences professional summary)",
            "verification": {
                "verified": ["string (e.g., 'GitHub Activity', 'Valid LinkedIn URL')"],
                "unverified": ["string (e.g., 'University Transcript')"]
            }
        }
      }
      
      If specific achievements are vague (e.g., "Participated in hackathons" without naming them, or "Built full stack app" without details), you MAY ask clarifying questions. 
      Only ask questions if the answer would significantly improve the resume quality (by >50%). Limit to maximum 3 questions.
      
      Add this to the JSON response:
      "suggestedRoles": ["string (e.g., 'Frontend Engineer')", "string (e.g., 'Full Stack Developer')"] (Max 3 suggestions),
      "clarificationQuestions": [
        {
          "id": "string",
          "question": "string (Targeted question)",
          "context": "string (The vague claim causing the question)"
        }
      ] (Optional, array of objects)
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
