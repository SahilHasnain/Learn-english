import { getApiKey } from "./appwriteConfig";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

let GROQ_API_KEY: string | null = null;

async function getGroqApiKey(): Promise<string> {
  if (!GROQ_API_KEY) {
    GROQ_API_KEY = await getApiKey("groq");
  }
  return GROQ_API_KEY;
}

interface WordSuggestion {
  word: string;
  level: "beginner" | "intermediate" | "advanced";
  sentence: string;
  conversationStarters: string[];
  hindiMeaning: string;
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

interface RelatedWord {
  word: string;
  relation: string;
  example: string;
  hindiMeaning: string;
}

interface RelatedWordsCluster {
  category: string;
  words: RelatedWord[];
}

export async function analyzeImageWithGroq(
  base64Image: string,
): Promise<WordSuggestion[]> {
  console.log("=== GROQ API DEBUG ===");

  try {
    const GROQ_API_KEY = await getGroqApiKey();
    console.log("API Key loaded from database");
    console.log("API Key length:", GROQ_API_KEY?.length);
    console.log("API Key first 10 chars:", GROQ_API_KEY?.substring(0, 10));
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
                text: `Analyze this image and identify the main object. Then provide exactly 3 English vocabulary words related to this object at different difficulty levels (beginner, intermediate, advanced). For each word, create a natural example sentence AND 3 conversation starters that someone could actually use in real life when talking about this object. Also provide the Roman Hindi (Hindi written in English letters) translation for each word - use SIMPLE, COMMON Hindi words that everyday people use in conversation, NOT English words written in Hindi script or formal Sanskrit words.

CRITICAL: Use actual Hindi vocabulary words, not English words transliterated. 

Examples of CORRECT translations:
- curtain → "parda" (NOT "pat" or "curtain")
- drapery → "parda" (NOT "pat ya drapery")
- cup → "pyala" or "katori"
- book → "kitab" or "pustak"
- water → "pani"
- food → "khana"
- big → "bada"
- small → "chota"
- window → "khidki"
- door → "darwaza"
- table → "mez"
- chair → "kursi"

Return ONLY a valid JSON array in this exact format, no other text:
[
  {"word": "word1", "level": "beginner", "sentence": "example sentence", "conversationStarters": ["starter1", "starter2", "starter3"], "hindiMeaning": "actual hindi word"},
  {"word": "word2", "level": "intermediate", "sentence": "example sentence", "conversationStarters": ["starter1", "starter2", "starter3"], "hindiMeaning": "actual hindi word"},
  {"word": "word3", "level": "advanced", "sentence": "example sentence", "conversationStarters": ["starter1", "starter2", "starter3"], "hindiMeaning": "actual hindi word"}
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
  try {
    const GROQ_API_KEY = await getGroqApiKey();
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
  try {
    const GROQ_API_KEY = await getGroqApiKey();
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

export async function getRelatedWords(
  words: string[],
): Promise<RelatedWordsCluster[]> {
  try {
    const GROQ_API_KEY = await getGroqApiKey();
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
            content: `Given these words: ${words.join(", ")}

Create 3 semantic clusters of related vocabulary that would help an English learner build deeper understanding. For each cluster, provide 4-5 related words with their relationship to the original words, a simple example, and the Roman Hindi (Hindi written in English letters) translation - use SIMPLE, COMMON Hindi words that everyday people use in conversation, NOT English words transliterated or formal Sanskrit words.

CRITICAL: Use actual Hindi vocabulary words, not English words written in Hindi script.

Examples of CORRECT translations:
- hot → "garam"
- cold → "thanda"
- big → "bada"
- small → "chota"
- new → "naya"
- old → "purana"
- beautiful → "sundar" or "khoobsurat"
- clean → "saaf"
- dirty → "ganda"
- open → "khula"
- closed → "band"

Return ONLY a valid JSON array in this exact format, no other text:
[
  {
    "category": "Category Name (e.g., 'Actions', 'Physical Properties', 'Related Objects')",
    "words": [
      {"word": "related word", "relation": "how it relates (e.g., 'verb form', 'opposite', 'similar object')", "example": "simple example sentence", "hindiMeaning": "actual hindi word"},
      {"word": "related word", "relation": "relationship", "example": "example", "hindiMeaning": "actual hindi word"}
    ]
  }
]

Make the categories practical and useful for real conversations.`,
          },
        ],
        temperature: 0.8,
        max_tokens: 800,
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

    console.log("Related words raw content:", content);

    // Clean up the content - remove markdown code blocks if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    } else if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/```\n?/g, "");
    }

    // Try to find JSON array in the content
    const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanContent = jsonMatch[0];
    }

    console.log("Cleaned content:", cleanContent);

    return JSON.parse(cleanContent);
  } catch (error) {
    console.error("Error getting related words:", error);
    throw error;
  }
}

export async function generateMicroStory(
  words: { word: string; hindiMeaning: string }[],
): Promise<string> {
  try {
    const GROQ_API_KEY = await getGroqApiKey();
    const wordList = words
      .map((w) => `${w.word} (${w.hindiMeaning})`)
      .join(", ");
    const justWords = words.map((w) => w.word).join(", ");

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
            content: `You are a creative storyteller for English learners. Write a vivid, immersive micro-story (exactly 4-5 sentences) that naturally weaves ALL of these words into one relatable real-life scene: ${justWords}

Rules:
- Make the scene feel like a moment the reader is LIVING through (use "you" perspective)
- Bold each vocabulary word by wrapping it in **double asterisks**
- After each bolded word, add the Hindi meaning in parentheses like: **bookmark** (panne ka nishan)
- Use simple, everyday English — the story should feel effortless to read
- Make the scene cozy, vivid, and emotionally engaging — the reader should FEEL the moment
- Do NOT start with "You walk into" — be more creative with the opening

Words with Hindi meanings: ${wordList}

Return ONLY the story text, nothing else. No title, no label, no quotes around it.`,
          },
        ],
        temperature: 0.9,
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

    return content.trim();
  } catch (error) {
    console.error("Error generating micro story:", error);
    throw error;
  }
}

export async function generateFlashback(
  word: string,
  hindiMeaning: string,
): Promise<string> {
  try {
    const GROQ_API_KEY = await getGroqApiKey();

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
            content: `Write exactly ONE short, vivid English sentence using the word "${word}" (Hindi: ${hindiMeaning}). The sentence should:
- Be a completely NEW and creative usage (not a textbook example)
- Feel like something from real life — a scene, moment, or observation
- Be simple enough for an English learner but interesting enough to remember
- Be 10-20 words long

Return ONLY the sentence, nothing else. No quotes, no label, no explanation.`,
          },
        ],
        temperature: 1.0,
        max_tokens: 60,
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

    return content.trim().replace(/^["']|["']$/g, "");
  } catch (error) {
    console.error("Error generating flashback:", error);
    throw error;
  }
}
