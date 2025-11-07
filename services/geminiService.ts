// jumantarareqi20/vto-wastra-adat-nusantara/vto-wastra-adat-nusantara-f59a9943b4174851adc83554fc2df2d15ebc9506/services/geminiService.ts

import { GoogleGenAI, Modality } from "@google/genai";
import type { ClothingItem } from "../types";

const API_KEY = process.env.API_KEY;

// Pindahkan cek API_KEY ke dalam fungsi yang menggunakannya
// const ai = new GoogleGenAI({ apiKey: API_KEY }); // Jangan inisialisasi di sini

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
  
  // === PINDAHKAN CEK KE SINI ===
  if (!API_KEY) {
    console.error("API_KEY environment variable not set");
    throw new Error("Koneksi ke AI gagal: API Key tidak ditemukan.");
  }
  // Inisialisasi AI di sini, hanya saat dibutuhkan
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  // ===============================

  try {
    const model = 'gemini-2.5-flash-image';
    
    // === FIX NETWORK ERROR ADA DI SINI ===
    // HAPUS PROXY. Kita fetch langsung ke aset kita sendiri.
    // Browser bisa fetch dari origin (domain) yang sama tanpa masalah CORS.
    // const proxyUrl = 'https://api.allorigins.win/raw?url='; // <--- HAPUS INI
    
    // Ganti baris fetch lama dengan ini:
    const response = await fetch(clothingItem.imageUrl);
    // ===================================

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