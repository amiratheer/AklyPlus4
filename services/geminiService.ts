
import { GoogleGenAI } from "@google/genai";

/**
 * Generates an administrative summary and insights based on provided data.
 */
export const generateAdminInsights = async (dataSummary: string): Promise<string> => {
  // Always initialize with apiKey from process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بناءً على البيانات التالية للمستخدمين والمهام، قم بإنشاء تقرير ملخص سريع (باللغة العربية) يتضمن التوصيات: ${dataSummary}`,
      config: {
        temperature: 0.7,
      }
    });
    // Access the .text property directly (not a method)
    return response.text || "لم نتمكن من الحصول على رؤى في الوقت الحالي.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ أثناء التواصل مع الذكاء الاصطناعي.";
  }
};

/**
 * Generates a professional description for a task or item.
 */
export const generateTaskDescription = async (taskTitle: string): Promise<string> => {
  // Always initialize with apiKey from process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `اكتب وصفاً مختصراً ومهنياً لهذه المهمة: ${taskTitle}`,
      config: {
        temperature: 0.5,
      }
    });
    // Access the .text property directly (not a method)
    return response.text || "لا يوجد وصف متاح.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "خطأ في إنشاء الوصف.";
  }
};
