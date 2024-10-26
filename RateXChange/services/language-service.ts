// services/language-service.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_KEY = "selectedLanguage";

export type Language = "en" | "th";

// Save the selected language to AsyncStorage
export const saveLanguage = async (language: Language): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error("Failed to save language:", error);
  }
};

// Load the saved language from AsyncStorage
export const loadLanguage = async (): Promise<Language> => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    return (savedLanguage as Language) || "en"; // Default to English if no saved language
  } catch (error) {
    console.error("Failed to load language:", error);
    return "en"; // Default to English in case of error
  }
};
