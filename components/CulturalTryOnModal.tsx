// components/CulturalExperienceModal.tsx
import React, { useState, useRef } from 'react';
import type { ClothingItem } from '../types';
import { generateVirtualTryOn, generateCulturalValidation } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import { IconUpload, IconCamera, IconSparkles, IconDownload } from './Icons'; // Pastikan icon tersedia

interface CulturalExperienceModalProps {
  item: ClothingItem;
  onClose: () => void;
}

type Mode = 'HERITAGE' | 'FUSION';

export const CulturalTryOnModal: React.FC<CulturalExperienceModalProps> = ({ item, onClose }) => {
  // State UI
  const [activeTab, setActiveTab] = useState<Mode>('HERITAGE');
  
  // State Data
  const [personImageFile, setPersonImageFile] = useState<File | null>(null);
  const [personImagePreview, setPersonImagePreview] = useState<string | null>(null);
  const [fusionPrompt, setFusionPrompt] = useState("");
  
  // State Proses AI
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [validationText, setValidationText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processStep, setProcessStep] = useState<string>(""); // Untuk status loading detail

  // Handle Upload Foto
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPersonImageFile(file);
      setGeneratedImage(null);
      setValidationText(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => setPersonImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Logic Utama Generate
  const handleGenerate = async () => {
    if (!personImageFile) {
      setError("Mohon unggah foto Anda terlebih dahulu.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setGeneratedImage(null);
    setValidationText(null);

    try {
      // 1. Konversi Foto User
      setProcessStep("Mengunggah foto & mempersiapkan AI...");
      const personBase64 = await fileToBase64(personImageFile);

      // 2. Generate Gambar (Heritage / Fusion)
      setProcessStep(activeTab === 'HERITAGE' 
        ? "AI sedang menenun baju adat ke tubuh Anda..." 
        : "AI sedang merancang busana Fusion sesuai gaya Anda...");
      
      const resultImage = await generateVirtualTryOn(
        personBase64, 
        item, 
        activeTab, 
        activeTab === 'FUSION' ? fusionPrompt : undefined
      );

      setGeneratedImage(resultImage);

      // 3. Jika Mode FUSION, Jalankan Cultural Validation (Vision)
      if (activeTab === 'FUSION') {
        setProcessStep("Kurator budaya sedang menganalisis hasil desain...");
        const validation = await generateCulturalValidation(item, fusionPrompt, resultImage);
        setValidationText(validation);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat memproses.");
    } finally {
      setIsProcessing(false);
      setProcessStep("");
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `WastraNusa-${activeTab}-${item.name.replace(/\s+/g, '-')}.png`;
      link.click();
    }
  };

  return (
  <div 
    className="
      fixed right-0 top-1/2 -translate-y-1/2 
      w-[380px] md:w-[420px] 
      max-h-[70vh]
      z-40 
      bg-white shadow-xl border-r border-stone-200 
      rounded-3xl 
      overflow-y-auto 
      animate-slide-in
    "
  >
      {/* Backdrop Blur */}
      {/* <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" onClick={onClose} /> */}

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* --- KOLOM KANAN: STUDIO AI (60%) --- */}
        <div className="w-full p-6 md:p-8 flex flex-col bg-white relative">
            
            {/* Tab Switcher */}
            <div className="flex bg-stone-100 p-1 rounded-2xl mb-6 mx-auto w-full max-w-md">
                <button 
                    onClick={() => setActiveTab('HERITAGE')}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'HERITAGE' ? 'bg-white shadow-md text-amber-900' : 'text-stone-500 hover:text-stone-700'}`}
                >
                    Heritage Mode
                </button>
                <button 
                    onClick={() => setActiveTab('FUSION')}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'FUSION' ? 'bg-gradient-to-r from-amber-600 to-amber-800 shadow-md text-white' : 'text-stone-500 hover:text-stone-700'}`}
                >
                    Fusion Mode ✨
                </button>
            </div>

            {/* Main Studio Area */}
            <div className="flex-grow flex flex-col overflow-y-auto custom-scrollbar">
                
                {/* 1. Input Section */}
                {!generatedImage && (
                    <div className="space-y-6 max-w-lg mx-auto w-full animate-fade-in-up">
                        <div className="text-center mb-4">
                            <h3 className="font-display text-2xl font-bold text-stone-800">
                                {activeTab === 'HERITAGE' ? 'Coba Secara Virtual' : 'Eksperimen Gaya Modern'}
                            </h3>
                            <p className="text-stone-500 text-sm mt-1">
                                {activeTab === 'HERITAGE' 
                                    ? 'Unggah fotomu dan lihat dirimu mengenakan pakaian adat ini sesuai pakem aslinya.'
                                    : 'Padukan motif wastra ini dengan gaya modern favoritmu. Biarkan AI berkreasi!'}
                            </p>
                        </div>

                        {/* Upload Box */}
                        <div className="relative group cursor-pointer">
                           <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                           <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${personImagePreview ? 'border-amber-500 bg-amber-50' : 'border-stone-300 hover:border-amber-400 hover:bg-stone-50'}`}>
                                {personImagePreview ? (
                                    <div className="relative h-48 mx-auto w-fit">
                                        <img src={personImagePreview} alt="Preview" className="h-full object-contain rounded-lg shadow-sm" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-white font-medium text-sm">
                                            Ganti Foto
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-4">
                                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400 group-hover:text-amber-600 transition-colors">
                                            <IconUpload className="w-8 h-8" />
                                        </div>
                                        <p className="font-semibold text-stone-700">Klik untuk unggah foto</p>
                                        <p className="text-xs text-stone-400 mt-1">Format JPG/PNG. Pastikan wajah terlihat jelas.</p>
                                    </div>
                                )}
                           </div>
                        </div>

                        {/* Fusion Prompt Input */}
                        {activeTab === 'FUSION' && (
                            <div className="animate-fade-in">
                                <label className="block text-sm font-bold text-stone-700 mb-2">Mau gaya seperti apa?</label>
                                <textarea 
                                    value={fusionPrompt}
                                    onChange={(e) => setFusionPrompt(e.target.value)}
                                    placeholder="Contoh: Padukan dengan jaket denim oversized dan sneakers untuk gaya street style yang kasual."
                                    className="w-full border border-stone-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all min-h-[80px]"
                                />
                            </div>
                        )}

                        {/* Action Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={!personImageFile || isProcessing || (activeTab === 'FUSION' && !fusionPrompt.trim())}
                            className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold shadow-lg hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <IconSparkles className="w-5 h-5" />
                                    {activeTab === 'HERITAGE' ? 'Mulai Try-On' : 'Generate Fusion Style'}
                                </>
                            )}
                        </button>
                        
                        {/* Error Message */}
                        {error && (
                            <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>
                        )}
                    </div>
                )}

                {/* 2. Loading State Overlay */}
                {isProcessing && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin mb-6"></div>
                        <h4 className="text-xl font-bold text-stone-800 font-display animate-pulse">Sedang Menjahit Pixel...</h4>
                        <p className="text-stone-500 mt-2 max-w-xs">{processStep}</p>
                    </div>
                )}

                {/* 3. Result Section */}
                {generatedImage && !isProcessing && (
                    <div className="flex flex-col h-full animate-fade-in">
                        <div className="flex-grow relative bg-stone-100 rounded-2xl overflow-hidden mb-4 border border-stone-200 group">
                            <img src={generatedImage} alt="Result" className="w-full h-full object-contain" />
                            
                            {/* Overlay Download Button */}
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    onClick={handleDownload}
                                    className="bg-white text-stone-900 px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
                                >
                                    <IconDownload className="w-5 h-5" />
                                    Unduh Hasil
                                </button>
                            </div>

                            <button onClick={() => setGeneratedImage(null)} className="absolute top-4 left-4 bg-white/80 p-2 rounded-full text-stone-600 hover:text-red-600 text-xs font-bold shadow-sm">
                                ← Coba Lagi
                            </button>
                        </div>

                        {/* Cultural Validation Box (Fusion Only) */}
                        {activeTab === 'FUSION' && validationText && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                                <h4 className="text-amber-900 font-bold text-sm flex items-center gap-2 mb-2">
                                    <span className="text-lg">🧐</span> Validasi Budaya
                                </h4>
                                <p className="text-stone-700 text-sm italic leading-relaxed">
                                    "{validationText}"
                                </p>
                            </div>
                        )}
                        
                        {activeTab === 'HERITAGE' && (
                             <p className="text-center text-stone-500 text-sm italic">
                                "Pakaian ini adalah identitas. Mengenakannya adalah bentuk penghormatan."
                            </p>
                        )}
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};