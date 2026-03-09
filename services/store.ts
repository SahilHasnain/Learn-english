import { create } from "zustand";
import { getApiKey } from "./appwriteConfig";

interface AppStore {
  groqApiKey: string | null;
  fetchApiKey: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set) => ({
  groqApiKey: null,
  fetchApiKey: async () => {
    try {
      const key = await getApiKey("groq");
      set({ groqApiKey: key });
    } catch (error) {
      console.error("Failed to fetch API key:", error);
    }
  },
}));
