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
 * * @param personImage - Objek gambar pengguna (base64 & mimetype)
 * @param clothingItem - Data pakaian adat yang dipilih
 * @param mode - 'HERITAGE' untuk pelestarian, 'FUSION' untuk gaya modern
 * @param fusionPrompt - Deskripsi gaya modern (hanya dipakai di mode FUSION)
 */
export const generateVirtualTryOn = async (
  personImage: { data: string; mimeType: string },
  clothingItem: ClothingItem,
  mode: 'HERITAGE' | 'FUSION' = 'HERITAGE', // Default ke Heritage
  fusionPrompt?: string 
): Promise<string> => {
  
  // Cek API Key
  if (!API_KEY) {
    console.error("API_KEY environment variable not set");
    throw new Error("Koneksi ke AI gagal: API Key tidak ditemukan.");
  }
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    // Gunakan model image generation
    const model = 'gemini-2.5-flash-image';
    
    // 1. Fetch gambar pakaian dari URL aset
    // Kita fetch langsung ke public folder sendiri
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

    // 2. Siapkan parts gambar untuk dikirim ke AI
    const personPart = fileToGenerativePart(personImage.data, personImage.mimeType);
    const clothingPart = fileToGenerativePart(clothingImageBase64, clothingMimeType);

    // 3. Tentukan Prompt berdasarkan Mode
    let finalPrompt = "";

    if (mode === 'HERITAGE') {
      // --- LOGIKA LAMA (Strict Preservation) ---
      finalPrompt = `You are a fashion AI expert specializing in virtual try-on of traditional Indonesian clothing. Your task is to realistically place the provided traditional garment onto the person in the photo.

      **Instructions:**
      1.  Identify the garment in the second image and the person in the first image.
      2.  Seamlessly overlay the garment onto the person, paying close attention to body shape, posture, and lighting.
      3.  Maintain the original background of the person's photo.
      4.  The result should be a high-quality, photorealistic image. Do not alter the person's face or body, only add the clothing.
      
      The garment is: ${clothingItem.name} from ${clothingItem.origin}.`;

    } else {
      // --- LOGIKA BARU (Fusion / Modern Mix) ---
      const userStyle = fusionPrompt || "modern casual style";
      
      finalPrompt = `You are a visionary fashion designer specializing in 'Cultural Fusion' style. 
      Your task is to REDESIGN the outfit of the person in the first image by combining elements from the traditional cloth (second image) with a specific modern style.

      **Fusion Instructions:**
      1.  **Core Material:** You MUST preserve the key fabric patterns (Wastra), textures, and colors from the traditional garment (${clothingItem.name}).
      2.  **Modern Style:** Adapt the cut, silhouette, or layering to match this style description: "${userStyle}".
      3.  **Integration:** Blend the traditional fabric into the modern item.
      4.  **Person:** Keep the person's face, pose, and background EXACTLY as they are in the first image. Only change the outfit.
      5.  **Output:** Create a photorealistic, high-fashion image.

      Target Style: ${userStyle} mixed with ${clothingItem.name} from ${clothingItem.origin}.`;
    }
    
    // 4. Panggil AI untuk Generate Gambar
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
          responseModalities: [Modality.IMAGE], // Wajib array untuk output gambar
      },
    });
    
    // 5. Ambil hasil gambar base64 dari response
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
 * Fungsi Baru: Cultural Validation dengan "Vision"
 * * Fungsi ini menganalisis gambar hasil generate (Fusion) untuk memberikan penjelasan 
 * filosofis yang akurat sesuai apa yang terlihat.
 * * @param clothingItem - Data baju adat asli
 * @param fusionStyle - Deskripsi gaya modern yang diminta user
 * @param generatedImageBase64 - Gambar hasil output AI (Fusion) untuk dianalisis
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
    // Kita gunakan model Flash 1.5 karena cepat, cerdas, dan multimodalnya bagus (bisa lihat gambar)
    const model = 'gemini-2.5-flash';

    // Bersihkan header data URI (data:image/jpeg;base64,) jika ada agar bersih
    const cleanBase64 = generatedImageBase64.replace(/^data:image\/(png|jpeg|webp);base64,/, "");
    
    // Siapkan gambar untuk dilihat AI
    // Kita asumsikan output gambar VTO adalah JPEG/PNG
    const imagePart = fileToGenerativePart(cleanBase64, "image/jpeg");

    const prompt = `
      Peran Anda adalah kurator budaya "WastraNusa".
      
      Tugas:
      Analisis GAMBAR yang saya lampirkan ini. Ini adalah hasil desain fashion "Fusion" (perpaduan modern).
      Gambar ini menggabungkan Baju Adat "${clothingItem.name}" dari ${clothingItem.origin} dengan gaya modern "${fusionStyle}".

      Berikan "Validasi Budaya" singkat (maksimal 3 kalimat) dalam Bahasa Indonesia yang inspiratif.
      
      PANDUAN PENTING:
      1. LIHAT GAMBARNYA DULU. Deskripsikan secara spesifik bagaimana motif/kain tradisional diterapkan di gambar tersebut (misal: "pada kerah", "sebagai outer", "pada lengan").
      2. Hubungkan elemen visual tersebut dengan filosofi asli: "${clothingItem.filosofi || 'lambang kehormatan dan identitas'}".
      3. Jangan berhalusinasi. Jika motifnya hanya sedikit, katakan itu sebagai aksen. Jika dominan, katakan dominan.

      Contoh Output yang diharapkan:
      "Sentuhan motif Songket yang ditempatkan pada saku jaket denim ini memberikan aksen modern yang cerdas. Meskipun tampil kasual, pola pucuk rebung tersebut tetap menyimbolkan harapan baik, membuktikan bahwa tradisi bisa relevan di gaya jalanan masa kini."
    `;

    const result = await ai.models.generateContent({
      model: model,
      contents: [{ 
        role: 'user', 
        parts: [
            imagePart,
            { text: prompt }
        ] 
      }],
    });

    const responseText = result.text;
    return responseText || "Validasi budaya berhasil, namun detail tidak tersedia.";

  } catch (error) {
    console.error("Error generating validation:", error);
    // Fallback jika validasi gagal, tapi gambar utama sudah sukses
    return "Paduan budaya yang menarik! Tetap lestarikan warisan leluhur dalam gaya modernmu.";
  }
};