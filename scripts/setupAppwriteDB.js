const { Client, Databases, ID } = require("node-appwrite");
require("dotenv").config({ path: ".env.local" });

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = "scanlearn-db";
const COLLECTION_ID = "api-keys";

async function setupDatabase() {
  try {
    console.log("🚀 Setting up Appwrite database...");

    // Create database
    try {
      await databases.create(DATABASE_ID, "ScanLearn Database");
      console.log("✅ Database created");
    } catch (error) {
      if (error.code === 409) {
        console.log("ℹ️  Database already exists");
      } else {
        throw error;
      }
    }

    // Create collection for API keys
    try {
      await databases.createCollection(DATABASE_ID, COLLECTION_ID, "API Keys", [
        // Permissions - adjust as needed
        'read("any")',
        'write("any")',
      ]);
      console.log("✅ Collection created");
    } catch (error) {
      if (error.code === 409) {
        console.log("ℹ️  Collection already exists");
      } else {
        throw error;
      }
    }

    // Create attributes
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        "service",
        255,
        true,
      );
      console.log("✅ 'service' attribute created");
    } catch (error) {
      if (error.code === 409) {
        console.log("ℹ️  'service' attribute already exists");
      } else {
        throw error;
      }
    }

    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        "apiKey",
        500,
        true,
      );
      console.log("✅ 'apiKey' attribute created");
    } catch (error) {
      if (error.code === 409) {
        console.log("ℹ️  'apiKey' attribute already exists");
      } else {
        throw error;
      }
    }

    // Wait for attributes to be available
    console.log("⏳ Waiting for attributes to be ready...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Store the GROQ API key
    try {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        service: "groq",
        apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY,
      });
      console.log("✅ GROQ API key stored in database");
    } catch (error) {
      if (error.code === 409) {
        console.log("ℹ️  GROQ API key already exists");
      } else {
        throw error;
      }
    }

    console.log("\n✨ Setup complete!");
    console.log(`\nDatabase ID: ${DATABASE_ID}`);
    console.log(`Collection ID: ${COLLECTION_ID}`);
    console.log(
      "\nYou can now remove EXPO_PUBLIC_GROQ_API_KEY from .env.local",
    );
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    process.exit(1);
  }
}

setupDatabase();
