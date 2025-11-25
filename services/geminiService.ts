// services/geminiService.ts

import { GoogleGenAI, Modality } from "@google/genai";
import type { ClothingItem } from "../types";

const API_KEY = process.env.API_KEY;

// Helper konversi file ke format yang dimengerti Gemini
const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
};

/**
 * Fungsi Utama: Menghasilkan Gambar (Heritage / Fusion)
 */
export const generateVirtualTryOn = async (
  personImage: { data: string; mimeType: string },
  clothingItem: ClothingItem,
  mode: 'HERITAGE' | 'FUSION' = 'HERITAGE', 
  fusionPrompt?: string 
): Promise<string> => {
  
  if (!API_KEY) {
    console.error("API_KEY environment variable not set");
    throw new Error("Koneksi ke AI gagal: API Key tidak ditemukan.");
  }
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const model = 'gemini-2.5-flash-image';
    
    // 1. Fetch gambar pakaian dari URL aset
    const response = await fetch(clothingItem.imageUrl);

    if (!response.ok) {
        throw new Error(`Gagal mengambil gambar pakaian: ${response.statusText}`);
    }
    const blob = await response.blob();
    const clothingImageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
    
    const clothingMimeType = blob.type;

    // 2. Siapkan parts gambar
    // Urutan penting: Orang dulu (sebagai referensi subjek), baru Baju (sebagai referensi gaya/objek)
    const personPart = fileToGenerativePart(personImage.data, personImage.mimeType);
    const clothingPart = fileToGenerativePart(clothingImageBase64, clothingMimeType);

    // 3. Tentukan Prompt & Config dengan instruksi STICT
    let finalPrompt = "";

    if (mode === 'HERITAGE') {
      finalPrompt = `You are an expert cultural fashion AI specializing in accurate Virtual Try-On for Indonesian traditional attire.
      
      **TASK:**
      Dress the user (from the FIRST image) in the traditional garment named "${clothingItem.name}" from ${clothingItem.origin}.

      **CRITICAL REQUIREMENTS (MUST FOLLOW):**
      1.  **IDENTITY PRESERVATION:** The face, facial features, skin tone, and body shape MUST remain EXACTLY the same as the person in the FIRST image. Do NOT replace the person with a generic model. This is a try-on, not a new character generation.
      2.  **CLOTHING AUTHENTICITY (PAKEM):** Generate the FULL traditional attire accurately according to the cultural standards (pakem) of ${clothingItem.origin}. 
          - Ensure complete accessories (headgear/tanjak/siger, sash/ulos/selendang, jewelry) are present if they are part of this outfit's standard look.
          - Do not crop or simplify the intricate patterns (Wastra).
      3.  **REALISTIC FIT:** The clothing must wrap naturally around the user's specific body pose in the first image.
      4.  **BACKGROUND:** Keep the background consistent with the first image if possible, or use a neutral studio background if blending is difficult.
      5.  **OUTPUT:** A high-quality, photorealistic Portrait Image (Aspect Ratio 3:4).`;

    } else {
      // FUSION MODE
      const userStyle = fusionPrompt || "modern casual style";
      
      finalPrompt = `You are a visionary fashion designer specializing in 'Cultural Fusion' style. 
      
      **TASK:**
      Redesign the outfit of the user (from the FIRST image) by blending the traditional Wastra patterns (from the SECOND image) with a modern style: "${userStyle}".

      **CRITICAL REQUIREMENTS:**
      1.  **IDENTITY PRESERVATION:** The face and identity of the person in the FIRST image must remain UNCHANGED. This is the most important rule.
      2.  **FUSION DESIGN:** Intelligently integrate the key patterns/textures of "${clothingItem.name}" into the modern silhouette described.
          - Example: Use the Batik pattern on a denim jacket, or Songket texture on a modern skirt.
      3.  **REALISM:** The result must look like a real photo of the user wearing this new custom outfit.
      4.  **OUTPUT:** A high-quality, photorealistic Portrait Image (Aspect Ratio 3:4).`;
    }
    
    // 4. Panggil AI
    const result = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          personPart,
          clothingPart,
          { text: finalPrompt }
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
          // @ts-ignore
          aspectRatio: "3:4", 
      },
    });
    
    // 5. Ambil hasil
    for (const part of result.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }

    throw new Error("Tidak ada gambar yang dihasilkan oleh AI.");

  } catch (error) {
    console.error("Error generating virtual try-on:", error);
    if (error instanceof Error) {
        throw new Error(`Proses AI gagal: ${error.message}`);
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui saat proses AI.");
  }
};

/**
 * Fungsi Validasi Budaya (Vision-based)
 */
export const generateCulturalValidation = async (
  clothingItem: ClothingItem,
  fusionStyle: string,
  generatedImageBase64: string 
): Promise<string> => {
  
  if (!API_KEY) {
    throw new Error("API Key tidak ditemukan.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const model = 'gemini-2.5-flash';
    const cleanBase64 = generatedImageBase64.replace(/^data:image\/(png|jpeg|webp);base64,/, "");
    const imagePart = fileToGenerativePart(cleanBase64, "image/jpeg");

    const prompt = `
      Peran Anda adalah kurator budaya "WastraNusa".
      
      Tugas:
      Analisis GAMBAR yang saya lampirkan ini. Ini adalah hasil desain fashion "Fusion".
      Baju Adat Asli: "${clothingItem.name}" (${clothingItem.origin}).
      Gaya Modern User: "${fusionStyle}".

      Berikan "Validasi Budaya" singkat (maksimal 5 kalimat) dalam Bahasa Indonesia.
      Jelaskan bagaimana motif tradisional diterapkan (misal: "pada kerah", "sebagai outer") dan hubungkan dengan filosofi asli: "${clothingItem.filosofi || 'identitas budaya'}".
    `;

    const result = await ai.models.generateContent({
      model: model,
      contents: [{ 
        role: 'user', 
        parts: [imagePart, { text: prompt }] 
      }],
    });

    const responseText = result.text;
    return responseText || "Validasi budaya berhasil.";

  } catch (error) {
    console.error("Error generating validation:", error);
    return "Paduan budaya yang menarik! Tetap lestarikan warisan leluhur dalam gaya modernmu.";
  }
};
