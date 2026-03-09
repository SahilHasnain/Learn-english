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
  conversationStarter: string;
  hindiMeaning: string;
  pronunciation: string;
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

function getMeaningLanguagePrompt(language: string): string {
  if (language === "urdu") {
    return `Also provide the Urdu meaning in Roman Urdu — the way Pakistanis ACTUALLY speak in daily life.

CRITICAL URDU RULES:
- Write Urdu the way Pakistanis naturally speak — casual, everyday Urdu
- Give a short, natural phrase or word — NOT a dictionary definition
- If people commonly use the English word itself, mention it

Examples of CORRECT natural Urdu translations:
- curtain → "parda"
- cup → "cup / pyaala"
- book → "kitaab"
- water → "paani"
- food → "khaana"
- big → "bara"
- small → "chhota"
- window → "khirki"
- door → "darwaaza"
- beautiful → "khoobsurat"
- remember → "yaad rakhna"
- tired → "thaka hua"`;
  }
  if (language === "english") {
    return `Also provide a simple English definition — short and clear, like how you'd explain to a friend.

Examples:
- curtain → "cloth that covers a window"
- cup → "small container for drinking"
- beautiful → "very nice to look at"
- tired → "feeling like you need rest"`;
  }
  // Default: Hindi
  return `Also provide the Hindi meaning in Roman Hindi — the way Indians ACTUALLY speak in daily life. Think of how a person in Delhi, Mumbai, or any Indian city would say it casually.

CRITICAL HINDI RULES:
- Write Hindi the way Indians naturally speak — use common Hinglish if that's more natural
- Give a short, natural phrase or word — NOT a dictionary definition
- If Indians commonly use the English word itself in conversation, mention it: e.g., "table" → "table (mez bhi bolte hain)"
- Prefer the word that would come to mind FIRST for a Hindi speaker

Examples of CORRECT natural Hindi translations:
- curtain → "parda"
- cup → "cup / pyaala"
- book → "kitaab"
- water → "paani"
- food → "khaana"
- big → "bada"
- small → "chhota"
- window → "khidki"
- door → "darwaaza"
- table → "table / mez"
- chair → "kursi"
- beautiful → "khoobsurat"
- remember → "yaad rakhna"
- tired → "thaka hua"`;
}

function getMeaningFieldLabel(language: string): string {
  if (language === "urdu") return "natural urdu as Pakistanis speak";
  if (language === "english") return "simple english definition";
  return "natural hindi as Indians speak";
}

export async function analyzeImageWithGroq(
  base64Image: string,
  userLevel: "beginner" | "intermediate" | "advanced" = "intermediate",
  language: string = "hindi",
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
                text: `Analyze this image and identify the main object. Then provide exactly 3 English vocabulary words related to this object. The user's English level is "${userLevel}", so adjust word difficulty and sentence complexity accordingly:
- beginner: simple everyday words, short easy sentences
- intermediate: moderately challenging words, natural sentences
- advanced: sophisticated vocabulary, complex sentences

For each word, create a natural example sentence AND 1 conversation starter that someone could actually use in real life.

CONVERSATION STARTER RULES:
- Make starters feel like real conversations in India/Pakistan — not generic Western small talk
- Use situations common in South Asian daily life: chai, traffic, family gatherings, street food, weather, festivals, college, office
- Examples: "This chai is really refreshing, isn't it?", "The traffic today was absolutely terrible"

${getMeaningLanguagePrompt(language)}

Also provide a pronunciation hint — write how the word SOUNDS using simple Roman ${language === "urdu" ? "Urdu" : language === "english" ? "English" : "Hindi"} phonetics (NOT IPA). Capitalize the stressed syllable.
Examples: "sophisticated" → "so-FIS-ti-kay-ted", "curtain" → "KUR-ten", "beautiful" → "BYOO-ti-ful"

Return ONLY a valid JSON array in this exact format, no other text:
[
  {"word": "word1", "level": "beginner", "sentence": "example sentence", "conversationStarter": "one natural starter", "hindiMeaning": "${getMeaningFieldLabel(language)}", "pronunciation": "phonetic hint"},
  {"word": "word2", "level": "intermediate", "sentence": "example sentence", "conversationStarter": "one natural starter", "hindiMeaning": "${getMeaningFieldLabel(language)}", "pronunciation": "phonetic hint"},
  {"word": "word3", "level": "advanced", "sentence": "example sentence", "conversationStarter": "one natural starter", "hindiMeaning": "${getMeaningFieldLabel(language)}", "pronunciation": "phonetic hint"}
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
        max_tokens: 600,
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

Predict 1 most likely response they might get, and suggest a short, natural follow-up reply. Keep both response and follow-up concise (1 sentence each).

Return ONLY a valid JSON array in this exact format, no other text:
[
  {"theirResponse": "short response", "yourFollowUp": "short follow-up"}
]`,
          },
        ],
        temperature: 0.8,
        max_tokens: 200,
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

function getL1MistakeContext(language: string): string {
  if (language === "urdu" || language === "hindi") {
    return `
COMMON MISTAKES by ${language === "hindi" ? "Hindi" : "Urdu"} speakers (check for these specifically):
- Missing articles: "I went to market" → "I went to THE market" (${language === "hindi" ? "Hindi" : "Urdu"} has no a/the)
- Wrong prepositions: "I am in the bus" → "I am ON the bus", "married with" → "married to"
- Tense confusion: "I am go" → "I am going", "He don't" → "He doesn't"
- Direct translations: "What is your good name?" → "What is your name?", "I have a doubt" → "I have a question"
- Wrong word order: "I yesterday went" → "I went yesterday"
- Missing 'to' with infinitive: "I want go" → "I want TO go"
- Redundant words: "return back" → "return", "revert back" → "revert"
- "Myself" misuse: "Myself Rahul" → "I am Rahul"`;
  }
  return "";
}

function getExplanationLanguageInstruction(language: string): string {
  if (language === "hindi") {
    return `Write the explanation in simple Roman Hindi (Hinglish) so the learner actually understands WHY.
Example: "'am go' galat hai — 'am' ke baad '-ing' lagta hai, toh 'am going' sahi hoga."
Keep it conversational, like a friend explaining.`;
  }
  if (language === "urdu") {
    return `Write the explanation in simple Roman Urdu so the learner actually understands WHY.
Example: "'am go' ghalat hai — 'am' ke baad '-ing' lagana hota hai, toh 'am going' sahi hai."
Keep it conversational, like a friend explaining.`;
  }
  return "Write the explanation in simple, clear English.";
}

export async function fixEnglishMistakes(
  userText: string,
  language: string = "hindi",
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
            content: `The user is a ${language === "hindi" ? "Hindi" : language === "urdu" ? "Urdu" : "English"} speaker learning English. They want to say: "${userText}"
${getL1MistakeContext(language)}

If there are grammar mistakes, awkward phrasing, or unnatural English, rewrite it to sound fluent and natural. Then explain what was wrong and why your version is better. If it's already perfect, say so.

${getExplanationLanguageInstruction(language)}

Return ONLY a valid JSON object in this exact format, no other text:
{"original": "${userText}", "corrected": "corrected version or same if perfect", "explanation": "brief explanation in ${language === "english" ? "English" : language === "urdu" ? "Roman Urdu" : "Roman Hindi"}"}`,
          },
        ],
        temperature: 0.7,
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
    console.error("Error fixing English mistakes:", error);
    throw error;
  }
}

export async function getRelatedWords(
  words: string[],
  language: string = "hindi",
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

Create 2 small clusters of related vocabulary. For each cluster, provide exactly 2 related words with their relationship, a short example, and the meaning.

${language === "urdu" ? "URDU RULES: Write meaning in Roman Urdu — the way Pakistanis actually speak." : language === "english" ? "MEANING RULES: Give a simple, short English definition." : "HINDI RULES: Use the word Indians would actually say in conversation. If they commonly use the English word, say so. Write in Roman Hindi."}

Return ONLY a valid JSON array in this exact format, no other text:
[
  {
    "category": "Category Name",
    "words": [
      {"word": "related word", "relation": "how it relates", "example": "short example", "hindiMeaning": "${getMeaningFieldLabel(language)}"},
      {"word": "related word", "relation": "relationship", "example": "short example", "hindiMeaning": "${getMeaningFieldLabel(language)}"}
    ]
  }
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
  language: string = "hindi",
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
            content: `Write a short, vivid micro-story (exactly 2 sentences) using ALL of these words: ${justWords}

Rules:
- Use "you" perspective — make the reader feel the moment
- Bold each vocabulary word with **double asterisks**
- After each bolded word, add ${language === "english" ? "simple English meaning" : language === "urdu" ? "Roman Urdu meaning" : "Hindi meaning"} in parentheses: **bookmark** (${language === "english" ? "a saved page marker" : language === "urdu" ? "nishaan" : "panne ka nishan"})
- Keep it simple and natural — easy to read quickly
- Be creative with the opening
${language !== "english" ? `- Naturally mix in 1-2 casual ${language === "urdu" ? "Urdu" : "Hindi"} words/phrases where a bilingual person would (code-switching), like: "bilkul filmy scene" or "ekdum perfect"` : ""}

Words with meanings: ${wordList}

Return ONLY the story text, nothing else. No title, no label, no quotes.`,
          },
        ],
        temperature: 0.9,
        max_tokens: 150,
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
  language: string = "hindi",
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
            content: `Write exactly ONE short, vivid English sentence using the word "${word}" (${language === "english" ? "Meaning" : language === "urdu" ? "Urdu" : "Hindi"}: ${hindiMeaning}). The sentence should:
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

interface ReverseChallenge {
  prompt: string;
  hint: string;
  answer: string;
}

export async function generateReverseChallenge(
  language: string = "hindi",
): Promise<ReverseChallenge> {
  try {
    const GROQ_API_KEY = await getGroqApiKey();
    const langName =
      language === "urdu"
        ? "Urdu"
        : language === "english"
          ? "English"
          : "Hindi";
    const script =
      language === "urdu"
        ? "Roman Urdu"
        : language === "english"
          ? "English"
          : "Roman Hindi";

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
            content: `Generate a simple ${language === "english" ? "English" : langName} sentence that an English learner should translate INTO English.

Rules:
- The sentence should be something from daily life — ordering food, asking directions, talking to a friend
- Write it in ${script}${language !== "english" ? " (NOT in Devanagari or Nastaliq script)" : ""}
- Give a short hint (1-2 key English words that help)
- Provide the correct English translation

${language === "hindi" ? 'Example: {"prompt": "Mujhe ek cup chai chahiye", "hint": "cup, tea, want", "answer": "I want a cup of tea"}' : language === "urdu" ? '{"prompt": "Mujhe ek cup chai chahiye", "hint": "cup, tea, want", "answer": "I want a cup of tea"}' : 'Example: {"prompt": "Tell someone you want tea", "hint": "want, cup, tea", "answer": "I would like a cup of tea"}'}

Return ONLY a valid JSON object, no other text:
{"prompt": "sentence in ${script}", "hint": "key english words", "answer": "correct english translation"}`,
          },
        ],
        temperature: 0.9,
        max_tokens: 200,
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
    console.error("Error generating reverse challenge:", error);
    throw error;
  }
}

export interface DictionaryEntry {
  word: string;
  meaning: string;
  pronunciation: string;
  level: "beginner" | "intermediate" | "advanced";
  partOfSpeech: string;
  exampleSentence: string;
  synonyms: string[];
  antonyms: string[];
}

export async function lookupWord(
  word: string,
  language: string = "hindi",
): Promise<DictionaryEntry> {
  const GROQ_API_KEY = await getGroqApiKey();
  const meaningPrompt = getMeaningLanguagePrompt(language);
  const meaningLabel = getMeaningFieldLabel(language);

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
          content: `You are a dictionary. Look up the English word "${word}".

${meaningPrompt}

Return ONLY a valid JSON object with these fields:
{
  "word": "${word}",
  "meaning": "${meaningLabel} meaning of the word",
  "pronunciation": "phonetic pronunciation hint like 'uh-BRUPT'",
  "level": "beginner or intermediate or advanced — based on how common the word is",
  "partOfSpeech": "noun / verb / adjective / adverb / etc.",
  "exampleSentence": "a natural example sentence using the word",
  "synonyms": ["up to 3 synonyms"],
  "antonyms": ["up to 2 antonyms, empty array if none"]
}

IMPORTANT: Return ONLY the JSON, no markdown, no explanation.`,
        },
      ],
      temperature: 0.3,
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
}

export async function reverseLookupWord(
  word: string,
  language: string = "hindi",
): Promise<DictionaryEntry> {
  const GROQ_API_KEY = await getGroqApiKey();

  const langName =
    language === "urdu" ? "Urdu (Roman Urdu)" :
    language === "english" ? "English" :
    "Hindi (Roman Hindi)";

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
          content: `You are a dictionary. The user typed "${word}" which is a ${langName} word. Find the best matching English word for it.

Return ONLY a valid JSON object:
{
  "word": "the English word",
  "meaning": "the original ${langName} meaning / context",
  "pronunciation": "phonetic pronunciation of the English word like 'uh-BRUPT'",
  "level": "beginner or intermediate or advanced",
  "partOfSpeech": "noun / verb / adjective / adverb / etc.",
  "exampleSentence": "a natural English sentence using the word",
  "synonyms": ["up to 3 English synonyms"],
  "antonyms": ["up to 2 English antonyms, empty array if none"]
}

IMPORTANT: Return ONLY the JSON, no markdown, no explanation.`,
        },
      ],
      temperature: 0.3,
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
}
