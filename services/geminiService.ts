import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: In a real app, strict error handling for missing API KEY is needed.
// We assume process.env.API_KEY is available as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const GeminiService = {
  /**
   * Generates a blog post draft based on a topic.
   */
  generateArticleDraft: async (topic: string): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Teknik bir blog yazarı olarak, "${topic}" hakkında kapsamlı, eğitici ve Türkçe bir blog yazısı taslağı oluştur.
        
        Kurallar:
        1. Markdown formatı kullan.
        2. Kod örnekleri içersin (Tire üçlüsü \`\`\` kullanarak).
        3. Giriş, Gelişme ve Sonuç bölümleri olsun.
        4. Samimi ama profesyonel bir dil kullan.
        5. En fazla 500 kelime olsun.`,
      });
      
      return response.text || "AI yanıt üretemedi.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Yapay zeka servisine şu an ulaşılamıyor. Lütfen API anahtarınızı kontrol edin.";
    }
  },

  /**
   * Suggests tags for an article content.
   */
  suggestTags: async (content: string): Promise<string[]> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Aşağıdaki blog yazısı için 5 adet virgülle ayrılmış SEO uyumlu etiket öner:
        
        ${content.substring(0, 1000)}...`,
      });
      
      const text = response.text || "";
      return text.split(',').map(tag => tag.trim());
    } catch (error) {
      return ['Teknoloji', 'Yazılım'];
    }
  }
};