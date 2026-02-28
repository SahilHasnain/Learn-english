const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface WordSuggestion {
  word: string;
  level: "beginner" | "intermediate" | "advanced";
  sentence: string;
  conversationStarters: string[];
}

interface ConversationFlow {
  theirResponse: string;
  yourFollowUp: string;
}

interface MistakeFix {
  original: string;
  corrected: string;
  explanation: string;
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
                text: `Analyze this image and identify the main object. Then provide exactly 3 English vocabulary words related to this object at different difficulty levels (beginner, intermediate, advanced). For each word, create a natural example sentence AND 3 conversation starters that someone could actually use in real life when talking about this object.

Return ONLY a valid JSON array in this exact format, no other text:
[
  {"word": "word1", "level": "beginner", "sentence": "example sentence", "conversationStarters": ["starter1", "starter2", "starter3"]},
  {"word": "word2", "level": "intermediate", "sentence": "example sentence", "conversationStarters": ["starter1", "starter2", "starter3"]},
  {"word": "word3", "level": "advanced", "sentence": "example sentence", "conversationStarters": ["starter1", "starter2", "starter3"]}
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

export async function predictConversationFlow(
  conversationStarter: string,
): Promise<ConversationFlow[]> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: `Someone says: "${conversationStarter}"

Predict 3 likely responses they might get, and for each response, suggest a natural follow-up reply.

Return ONLY a valid JSON array in this exact format, no other text:
[
  {"theirResponse": "response1", "yourFollowUp": "follow-up1"},
  {"theirResponse": "response2", "yourFollowUp": "follow-up2"},
  {"theirResponse": "response3", "yourFollowUp": "follow-up3"}
]`,
          },
        ],
        temperature: 0.8,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content in response");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error predicting conversation flow:", error);
    throw error;
  }
}

export async function fixEnglishMistakes(
  userText: string,
): Promise<MistakeFix> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: `The user wants to say: "${userText}"

If there are grammar mistakes, awkward phrasing, or unnatural English, rewrite it to sound fluent and natural. Then explain what was wrong and why your version is better. If it's already perfect, say so.

Return ONLY a valid JSON object in this exact format, no other text:
{"original": "${userText}", "corrected": "corrected version or same if perfect", "explanation": "brief explanation of changes or 'Perfect! No changes needed.'"}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content in response");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error fixing English mistakes:", error);
    throw error;
  }
}
