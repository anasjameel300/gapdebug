import { NextRequest, NextResponse } from "next/server";
import { queryOpenRouter } from "@/lib/ai-client";

const MODEL_INTERN = process.env.MODEL_INTERN || "qwen/qwen3-next-80b-a3b-instruct:free";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("resume") as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
        }

        // 1. Extract Text from PDF - Dynamic import to avoid build issues
        const { PDFParse } = await import("pdf-parse");
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const parser = new PDFParse(buffer);
        const pdfData = await parser.getText();
        const rawText = pdfData.text;

        // Truncate if too long (free models have context limits, though Qwen is generous)
        const truncatedText = rawText.slice(0, 15000);

        // 2. The Intern's Job: Structured Extraction
        const systemPrompt = `
      You are an expert Resume Parser. Extract structured data from raw resume text.
      Return ONLY a valid JSON object with the following structure:
      {
        "persona": "student" | "job_seeker",
        "university": "string",
        "gradYear": "string",
        "role": "string (target role or current title)",
        "yearsOfExperience": number,
        "skills": ["string"],
        "achievements": "summary string of key achievements"
      }
      Do not include any explanation or markdown formatting.
    `;

        const userPrompt = `Here is the resume text:\n\n${truncatedText}`;

        // 3. Call AI
        const extractedData = await queryOpenRouter(MODEL_INTERN, systemPrompt, userPrompt, true);

        return NextResponse.json({
            success: true,
            data: {
                url: "mock-url-for-now", // In a real app, successful upload URL
                parsedData: extractedData
            }
        });

    } catch (error) {
        console.error("Resume Parse Route Error:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to parse resume" },
            { status: 500 }
        );
    }
}
