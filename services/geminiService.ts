import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn(
    "API_KEY for GoogleGenAI is not set in environment variables. AI features will not work. Please ensure it is set."
  );
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const genericGenerateText = async (prompt: string): Promise<string> => {
  if (!ai) {
    return Promise.reject("GoogleGenAI client not initialized. API_KEY missing.");
  }
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Error generating text with Gemini API:", error);
    throw error;
  }
};

interface WorldGenerationResponse {
  world_name_fa: string;
  world_details_fa: string;
  map_concept_fa: string;
}

const generateWorldDetailsAndMap = async (userWorldDescription: string): Promise<WorldGenerationResponse> => {
  if (!ai) {
    return Promise.reject("GoogleGenAI client not initialized. API_KEY missing.");
  }
  const prompt = `کاربر یک توصیف اولیه از جهان ارائه داده: '${userWorldDescription}'. 
بر اساس این توصیف، یک دنیای فانتزی غنی و جذاب برای یک بازی به سبک Dungeons & Dragons خلق کن. 
اگر کاربر در توصیف خود نامی برای جهان مشخص نکرده، یک نام مناسب فارسی برای آن پیشنهاد بده.
مناطق کلیدی، فرهنگ‌های منحصر به فرد، درگیری‌ها یا رازهای بالقوه، و عناصر جادویی مهم آن را با جزئیات شرح بده. این توصیفات باید حداقل ۳۰۰-۴۰۰ کلمه باشند. 
همچنین، یک مفهوم کلی برای نقشه این جهان به صورت متنی ارائه بده که شامل مناطق اصلی، شهرها و نقاط مهم باشد.
پاسخ باید یک شی JSON با ساختار زیر باشد: 
{ 
  "world_name_fa": "نام جهان به زبان فارسی (پیشنهادی یا بر اساس توصیف کاربر)",
  "world_details_fa": "جزئیات کامل جهان به زبان فارسی...", 
  "map_concept_fa": "مفهوم نقشه به زبان فارسی..." 
}
تمام متن‌های فارسی باید روان و جذاب باشند.`;

  let rawResponseText = "";
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    rawResponseText = response.text || "";
    let jsonStr = rawResponseText.trim();
    // Basic cleanup for markdown code blocks if the model adds them despite MIME type
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsed = JSON.parse(jsonStr);
    return parsed as WorldGenerationResponse;
  } catch (error) {
    console.error("Error generating world details:", error);
    throw error;
  }
};

const generateGuidedRandomWorld = async (genre: string, suggestedName: string, userDescription: string): Promise<WorldGenerationResponse> => {
  if (!ai) {
    return Promise.reject("GoogleGenAI client not initialized. API_KEY missing.");
  }
  
  let nameInstruction = '';
  if (suggestedName === "0") {
    nameInstruction = 'نام پیشنهادی کاربر: هوش مصنوعی با خلاقیت خود یک نام مناسب فارسی برای جهان انتخاب کند.';
  } else if (!suggestedName) {
    nameInstruction = 'نام پیشنهادی کاربر (اختیاری، اگر خالی است خودت یک نام مناسب فارسی انتخاب کن): نامشخص';
  } else {
    nameInstruction = `نام پیشنهادی کاربر: ${suggestedName}`;
  }

  const prompt = `یک جهان فانتزی برای بازی نقش آفرینی با مشخصات زیر خلق کن:
ژانر: ${genre}
${nameInstruction}
توصیف اولیه کاربر: """${userDescription}"""

بر اساس این ورودی‌ها، یک نام نهایی فارسی برای جهان، جزئیات کامل داستانی جهان (شامل مناطق، فرهنگ‌ها، رازها، جادو - حداقل ۳۰۰-۴۰۰ کلمه) و یک مفهوم نقشه متنی ارائه بده.
پاسخ باید یک شی JSON با ساختار زیر باشد:
{
  "world_name_fa": "نام نهایی جهان به فارسی",
  "world_details_fa": "جزئیات کامل جهان به فارسی...",
  "map_concept_fa": "مفهوم نقشه به فارسی..."
}
تمام متن‌های فارسی باید روان و جذاب باشند.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    let jsonStr = (response.text || "").trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    const parsed = JSON.parse(jsonStr);
    return parsed as WorldGenerationResponse;
  } catch (error) {
    console.error("Error generating guided random world:", error);
    throw error;
  }
};


interface ItemDataResponse {
  name_fa: string;
  rank_fa: string;
  level: number;
  description_fa: string;
  image_prompt: string;
}

const generateItemData = async (itemNameInput: string): Promise<ItemDataResponse> => {
  if (!ai) {
    return Promise.reject("GoogleGenAI client not initialized. API_KEY missing.");
  }
  // Updated prompt for Icon-like generation
  const prompt = `یک آیتم به سبک D&D برای نام '${itemNameInput}' بساز. 
پاسخ باید یک شیء JSON با ساختار زیر باشد: 
{ 
  "name_fa": "نام فارسی آیتم", 
  "rank_fa": "رتبه مانند معمولی، کمیاب، افسانه‌ای", 
  "level": 5, // یک عدد بین 1 تا 20 برای سطح آیتم
  "description_fa": "توضیحات کامل و جذاب آیتم به زبان فارسی، شامل ظاهر، خواص جادویی، و داستان احتمالی - حدود ۵۰ تا ۱۰۰ کلمه", 
  "image_prompt": "game icon of a ${itemNameInput}, isolated on black background, digital painting style, rpg item, detailed, 2d vector art, high quality, square" 
}
تمام متن‌های فارسی باید روان و جذاب باشند.`;

  try {
    const response = await ai.models.generateContent({ 
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    let jsonStr = (response.text || "").trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsed = JSON.parse(jsonStr);
    return parsed as ItemDataResponse;
  } catch (error) {
    console.error("Error generating item data:", error);
    throw error;
  }
};

interface CharacterGenerationResponse {
  character_details_fa: string;
  image_prompt_for_avatar: string;
}

const generateCharacterDetailsAndImagePrompt = async (
  characterName: string, 
  age: string, 
  characterClass: string, 
  race: string, 
  userDescription: string,
  worldDetails: string 
): Promise<CharacterGenerationResponse> => {
  if (!ai) {
    return Promise.reject("GoogleGenAI client not initialized. API_KEY missing.");
  }

  const ageInstruction = age === "0" ? "هوش مصنوعی با خلاقیت خود یک سن مناسب برای شخصیت انتخاب کند." : age;
  const classInstruction = characterClass === "0" ? "هوش مصنوعی با خلاقیت خود یک کلاس مناسب برای شخصیت انتخاب کند." : characterClass;
  const raceInstruction = race === "0" ? "هوش مصنوعی با خلاقیت خود یک نژاد مناسب برای شخصیت انتخاب کند." : race;
  
  const imagePromptInstruction = `یک دستور (prompt) مناسب برای ساخت تصویر آواتار این شخصیت ارائه بده. این دستور باید دقیق و توصیفی باشد و شامل نام شخصیت (${characterName}), سن (${age}), نژاد (${race}), و کلاس (${characterClass}) باشد. سبک: digital character portrait, close up, detailed face, fantasy rpg style.`;

  const prompt = `یک شخصیت برای بازی نقش آفرینی فارسی با مشخصات زیر و در جهان توصیف شده خلق کن:
نام شخصیت: ${characterName}
سن: ${ageInstruction}
کلاس اولیه: ${classInstruction}
نژاد: ${raceInstruction}
توصیف اولیه کاربر از شخصیت: """${userDescription}"""

جزئیات جهان: """${worldDetails}"""

بر اساس این اطلاعات، جزئیات بیشتری برای شخصیت خلق کن (مانند ویژگی‌های شخصیتی عمیق‌تر، مهارت‌های اولیه مرتبط با کلاس و نژاد، یک پیش‌زمینه داستانی کوتاه در این جهان). این جزئیات باید حدود ۱۵۰-۲۰۰ کلمه باشند.
همچنین، ${imagePromptInstruction}
پاسخ باید یک شی JSON با ساختار زیر باشد:
{
  "character_details_fa": "جزئیات تکمیلی شخصیت به فارسی...",
  "image_prompt_for_avatar": "دستور ساخت تصویر آواتار شخصیت مطابق با دستورالعمل بالا"
}
تمام متن‌های فارسی باید روان و جذاب باشند.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    let jsonStr = (response.text || "").trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    const parsed = JSON.parse(jsonStr);
    return parsed as CharacterGenerationResponse;
  } catch (error) {
    console.error("Error generating character details:", error);
    throw error;
  }
};


const generateImage = async (prompt: string): Promise<string> => {
  if (!ai) {
    return Promise.reject("GoogleGenAI client not initialized. API_KEY missing.");
  }
  try {
    // Using gemini-2.5-flash-image for standard image generation tasks per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating image with Gemini API:", error);
    // Fallback or re-throw.
    throw error;
  }
};

const generateAdventureResponse = async (
  worldDetails: string,
  characterName: string,
  inventoryList: string, 
  adventureLogTail: string, 
  playerInput: string
): Promise<string> => {
  if (!ai) {
    return Promise.reject("GoogleGenAI client not initialized. API_KEY missing.");
  }
  const prompt = `شما Dungeon Master یک بازی نقش‌آفرینی فارسی هستید.
جهان بازی: """${worldDetails}"""
شخصیت بازیکن: "${characterName}"
آیتم‌های بازیکن: """${inventoryList}"""
آخرین اتفاقات ماجرا: """${adventureLogTail}"""
بازیکن می‌گوید: "${playerInput}"

به عنوان Dungeon Master، داستان را ادامه بده، محیط را توصیف کن، و چالش‌ها را ارائه بده. 
پاسخ باید کاملا به زبان فارسی باشد و جذاب و گیرا روایت شود. 
پاسخ نباید شامل عبارت "شما Dungeon Master یک بازی نقش‌آفرینی فارسی هستید." باشد.
در پایان پاسخ، از بازیکن سوالی بازتر مانند "چه کاری می‌خواهید انجام دهید؟" بپرسید.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Error generating adventure response:", error);
    throw error;
  }
};

const expandMapConcept = async (currentMapConcept: string, worldDetails: string): Promise<string> => {
  if (!ai) {
    return Promise.reject("GoogleGenAI client not initialized. API_KEY missing.");
  }
  const prompt = `نقشه فعلی یک جهان فانتزی به این صورت توصیف شده است: """${currentMapConcept}"""
جزئیات کلی این جهان عبارتند از: """${worldDetails}"""

لطفاً این مفهوم نقشه را گسترش بده. مناطق جدید، نقاط مهم‌تر، یا جزئیات بیشتری به مناطق موجود اضافه کن. توضیحات باید به زبان فارسی و به صورت متنی باشند.`;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Error expanding map concept:", error);
    throw error;
  }
};


export const geminiService = {
  generateText: genericGenerateText,
  generateWorldDetailsAndMap,
  generateGuidedRandomWorld,
  generateCharacterDetailsAndImagePrompt,
  generateItemData,
  generateImage,
  generateAdventureResponse,
  expandMapConcept,
};