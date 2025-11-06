// jumantarareqi20/vto-wastra-adat-nusantara/vto-wastra-adat-nusantara-f59a9943b4174851adc83554fc2df2d15ebc9506/services/geminiService.ts

import { GoogleGenAI, Modality } from "@google/genai";
import type { ClothingItem } from "../types";

// Ambil API key dari environment
const API_KEY = process.env.API_KEY;

// !!! DIHAPUS !!!
// Pengecekan dan inisialisasi AI dihapus dari top-level
// Ini mencegah aplikasi crash saat load jika API_KEY belum ada.
/*
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });
*/

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
};

export const generateVirtualTryOn = async (
  personImage: { data: string; mimeType: string },
  clothingItem: ClothingItem
): Promise<string> => {

  // === PERBAIKAN KEAMANAN ===
  // Pindahkan pengecekan API Key dan inisialisasi AI ke dalam fungsi.
  // Ini hanya akan berjalan saat tombol "Generate" ditekan.
  if (!API_KEY) {
    console.error("API_KEY environment variable not set");
    // Lempar error di sini agar bisa ditangkap oleh try...catch di TryOnStudio.tsx
    throw new Error("Koneksi ke AI gagal: API Key tidak ditemukan.");
  }

  // Inisialisasi AI di sini, hanya saat akan digunakan.
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  // ==========================

  try {
    const model = 'gemini-2.5-flash-image';
    
    // Fetch clothing image and convert to base64.
    // Using a CORS proxy to prevent cross-origin issues in the browser.
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const response = await fetch(proxyUrl + encodeURIComponent(clothingItem.imageUrl));

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

    const personPart = fileToGenerativePart(personImage.data, personImage.mimeType);
    const clothingPart = fileToGenerativePart(clothingImageBase64, clothingMimeType);

    const prompt = `You are a fashion AI expert specializing in virtual try-on of traditional Indonesian clothing. Your task is to realistically place the provided traditional garment onto the person in the photo.

    **Instructions:**
    1.  Identify the garment in the second image and the person in the first image.
    2.  Seamlessly overlay the garment onto the person, paying close attention to body shape, posture, and lighting.
    3.  Maintain the original background of the person's photo.
    4.  The result should be a high-quality, photorealistic image. Do not alter the person's face or body, only add the clothing.
    
    The garment is: ${clothingItem.name} from ${clothingItem.origin}.
    `;
    
    const result = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          personPart,
          clothingPart,
          { text: prompt }
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE], // Must be an array with a single `Modality.IMAGE` element.
      },
    });
    
    // FIX: Add optional chaining and a fallback to an empty array to safely access response parts.
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
        // Kita teruskan pesan error yang spesifik
        throw new Error(`Proses AI gagal: ${error.message}`);
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui saat proses AI.");
  }
};