

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const SITE_NAME = "GapDebug";

// Error Types
type AIError = {
    error: {
        message: string;
        code: number;
    };
};

export async function queryOpenRouter(
    model: string,
    systemPrompt: string,
    userPrompt: string,
    jsonMode: boolean = true
) {
    if (!OPENROUTER_API_KEY) {
        throw new Error("Missing OPENROUTER_API_KEY in environment variables.");
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": SITE_URL,
                "X-Title": SITE_NAME,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
                // Force JSON mode if requested (some models support it better than others)
                response_format: jsonMode ? { type: "json_object" } : undefined,
            }),
        });

        if (!response.ok) {
            const errorData = (await response.json()) as AIError;
            console.error("OpenRouter Error:", errorData);
            throw new Error(errorData.error?.message || `API Error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
            throw new Error("No content received from AI model.");
        }

        // Attempt to parse JSON if we requested it
        if (jsonMode) {
            try {
                // Clean markdown code blocks if present (common in free models)
                const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
                return JSON.parse(cleaned);
            } catch (e) {
                console.error("JSON Parse Error. Raw Content:", content);
                throw new Error("Failed to parse AI response as JSON.");
            }
        }

        return content;
    } catch (error) {
        console.error("AI Client Failure:", error);
        throw error;
    }
}
