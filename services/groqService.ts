const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface WordSuggestion {
  word: string;
  level: "beginner" | "intermediate" | "advanced";
  sentence: string;
}

export async function analyzeImageWithGroq(
  base64Image: string,
): Promise<WordSuggestion[]> {
  console.log("=== GROQ API DEBUG ===");
  console.log("API Key exists:", !!GROQ_API_KEY);
  console.log("API Key length:", GROQ_API_KEY?.length);
  console.log("API Key first 10 chars:", GROQ_API_KEY?.substring(0, 10));
  console.log("Environment check:", {
    EXPO_PUBLIC_GROQ_API_KEY: process.env.EXPO_PUBLIC_GROQ_API_KEY
      ? "SET"
      : "NOT SET",
    allKeys: Object.keys(process.env).filter((k) => k.includes("GROQ")),
  });

  if (!GROQ_API_KEY) {
    throw new Error(
      "GROQ_API_KEY is not configured. Please add EXPO_PUBLIC_GROQ_API_KEY to your .env.local file and restart the dev server",
    );
  }

  try {
    console.log("Making request to Groq API...");
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this image and identify the main object. Then provide exactly 3 English vocabulary words related to this object at different difficulty levels (beginner, intermediate, advanced). For each word, create a natural example sentence.

Return ONLY a valid JSON array in this exact format, no other text:
[
  {"word": "word1", "level": "beginner", "sentence": "example sentence"},
  {"word": "word2", "level": "intermediate", "sentence": "example sentence"},
  {"word": "word3", "level": "advanced", "sentence": "example sentence"}
]`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content in response");
    }

    console.log("Raw content:", content);

    // Parse the JSON response
    const suggestions = JSON.parse(content);
    console.log("Parsed suggestions:", suggestions);
    return suggestions;
  } catch (error) {
    console.error("Error analyzing image with Groq:", error);
    throw error;
  }
}
