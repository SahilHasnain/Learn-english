import { Client, Databases, Query } from "react-native-appwrite";

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

const DATABASE_ID = "scanlearn-db";
const COLLECTION_ID = "api-keys";

let cachedApiKeys: Record<string, string> = {};

export async function getApiKey(service: string): Promise<string> {
  // Return from cache if available
  if (cachedApiKeys[service]) {
    return cachedApiKeys[service];
  }

  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("service", service),
    ]);

    if (response.documents.length === 0) {
      throw new Error(`API key for service '${service}' not found in database`);
    }

    const apiKey = response.documents[0].apiKey as string;

    // Cache the key
    cachedApiKeys[service] = apiKey;

    return apiKey;
  } catch (error) {
    console.error(`Error fetching API key for ${service}:`, error);
    throw error;
  }
}

export function clearApiKeyCache() {
  cachedApiKeys = {};
}
