import React, { useState, useCallback, useRef, useEffect } from 'react';
import { generateVirtualTryOn } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import type { ClothingItem } from '../types';
import { VTOStatus } from '../types';
import { ClothingSelector } from './ClothingSelector';
import { ClothingModal } from './ClothingModal'; // <-- (PENTING) Impor Modal di sini

interface TryOnStudioProps {
  selectedClothing: ClothingItem;
  onSelectClothing: (item: ClothingItem) => void;
}

export const TryOnStudio: React.FC<TryOnStudioProps> = ({ selectedClothing, onSelectClothing }) => {
  const [personImageFile, setPersonImageFile] = useState<File | null>(null);
  const [personImagePreview, setPersonImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<VTOStatus>(VTOStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // --- (LOGIKA MODAL DIPINDAHKAN KE SINI) ---
  // State untuk modal sekarang ada di sini, BUKAN di ClothingSelector.
  // Ini adalah perbaikan utamanya.
  const [modalItem, setModalItem] = useState<ClothingItem | null>(null);
  // --- (BATAS LOGIKA MODAL) ---

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      closeCamera();
      setPersonImageFile(file);
      setGeneratedImage(null);
      setStatus(VTOStatus.IDLE);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = useCallback(async () => {
    if (!personImageFile || !selectedClothing) {
      setError("Silakan unggah foto dan pilih pakaian adat terlebih dahulu.");
      return;
    }
    
    setError(null);
    setGeneratedImage(null);
    setStatus(VTOStatus.GENERATING);

    try {
      const personImageBase64 = await fileToBase64(personImageFile);
      const result = await generateVirtualTryOn(personImageBase64, selectedClothing);
      setGeneratedImage(result);
      setStatus(VTOStatus.SUCCESS);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Gagal menghasilkan gambar.");
      setStatus(VTOStatus.ERROR);
    }
  }, [personImageFile, selectedClothing]);

  const openCamera = async () => {
      if (isCameraOpen) return;
      setError(null);
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
          setPersonImagePreview(null);
          setPersonImageFile(null);
          setGeneratedImage(null);
          setStatus(VTOStatus.IDLE);
          setIsCameraOpen(true);
          streamRef.current = stream;
          if (videoRef.current) {
              videoRef.current.srcObject = stream;
          }
      } catch (err) {
          console.error("Error accessing camera:", err);
          setError("Tidak bisa mengakses kamera. Pastikan Anda memberikan izin pada browser.");
      }
  };
  
  const closeCamera = useCallback(() => {
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsCameraOpen(false);
      streamRef.current = null;
  }, []);

  const capturePhoto = () => {
      if (videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
              ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
              canvas.toBlob(blob => {
                  if (blob) {
                      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                      setPersonImageFile(file);
                      setPersonImagePreview(URL.createObjectURL(file));
                  }
              }, 'image/jpeg');
          }
          closeCamera();
      }
  };

  const handleDownload = () => {
    if (!generatedImage || !selectedClothing) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    
    const clothingName = selectedClothing.name.replace(/\s+/g, '_');
    const match = generatedImage.match(/^data:image\/(\w+);base64,/);
    const fileExtension = match ? match[1] : 'png';

    link.download = `WastraNusa_TryOn_${clothingName}.${fileExtension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOpen]);
  
  useEffect(() => {
    return () => {
      closeCamera();
    };
  }, [closeCamera]);

  return (
    // Gunakan React Fragment agar Modal bisa dirender di level atas
    <>
      <div className="pt-24 px-4 md:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 font-display">Virtual Try-On Baju Adat Nusantara</h1>
          <p className="mt-4 text-lg text-stone-600 max-w-3xl mx-auto">
            Rasakan pesona budaya melalui teknologi AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Input Column (Kiri) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex-grow w-full aspect-square flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm border-2 border-dashed border-stone-300 rounded-2xl p-2 overflow-hidden shadow-inner">
              {isCameraOpen ? (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-lg" />
              ) : personImagePreview ? (
                <img src={personImagePreview} alt="User" className="w-full h-full object-contain rounded-lg transition-all duration-300" />
              ) : (
                <div className="text-center text-stone-500 p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="mt-2 font-semibold">Foto Anda</p>
                    <p className="text-xs">Unggah atau ambil gambar</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 mt-4">
                {isCameraOpen ? (
                  <>
                    <button onClick={capturePhoto} className="w-full text-center cursor-pointer bg-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-700 transition-colors shadow-md">Ambil Foto</button>
                    <button onClick={closeCamera} className="w-full text-center cursor-pointer bg-white text-stone-700 font-semibold py-3 px-6 rounded-xl hover:bg-stone-100 transition-colors border border-stone-300">Tutup</button>
                  </>
                ) : (
                  <>
                    <label htmlFor="file-upload" className="w-full text-center cursor-pointer bg-white text-stone-700 font-semibold py-3 px-6 rounded-xl hover:bg-stone-100 transition-colors border border-stone-300">Unggah Foto</label>
                    <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} id="file-upload" className="hidden" />
                    <button onClick={openCamera} className="w-full text-center cursor-pointer bg-white text-stone-700 font-semibold py-3 px-6 rounded-xl hover:bg-stone-100 transition-colors border border-stone-300">Ambil Foto</button>
                  </>
                )}
            </div>
          </div>

          {/* Center/Controls Column (Tengah) */}
          <div className="lg:col-span-4 flex flex-col bg-white/60 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50">
              <ClothingSelector 
                selectedClothing={selectedClothing} 
                onSelectClothing={onSelectClothing}
                // --- (PERUBAHAN KUNCI) ---
                // Berikan fungsi untuk membuka modal ke ClothingSelector
                // Ini akan memberi tahu TryOnStudio untuk mengatur modalItem
                onShowDetails={() => setModalItem(selectedClothing)}
                // --- (BATAS PERUBAHAN) ---
              />
              <div className="mt-auto pt-6">
                  <button
                      onClick={handleTryOn}
                      disabled={!personImageFile || !selectedClothing || status === VTOStatus.GENERATING}
                      className="w-full bg-gradient-to-br from-amber-700 to-amber-900 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-amber-900/40 transition-all duration-300 disabled:from-stone-400 disabled:to-stone-500 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105"
                  >
                      {status === VTOStatus.GENERATING ? 'Memproses...' : 'Generate Tampilan'}
                  </button>
              </div>
          </div>
          
          {/* Output Column (Kanan) */}
          <div className="lg:col-span-4 flex flex-col">
              <div className="flex-grow w-full aspect-square flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm border-2 border-dashed border-stone-300 rounded-2xl p-2 overflow-hidden shadow-inner relative transition-all duration-300">
                  {status === VTOStatus.GENERATING ? (
                      <div className="text-center text-amber-900">
                          <svg className="animate-spin h-16 w-16 mx-auto" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                              <path d="M 50,50 L 10,50 A 40,40 0 0,1 90,50 Z" fill="#c0a080" transform="rotate(0, 50, 50)" />
                              <path d="M 50,50 L 90,50 A 40,40 0 0,1 10,50 Z" fill="#907050" transform="rotate(180, 50, 50)" />
                          </svg>
                          <p className="mt-4 font-semibold font-display text-lg">AI sedang menenun...</p>
                          <p className="text-sm mt-1">Proses ini mungkin perlu waktu.</p>
                      </div>
                  ) : generatedImage ? (
                      <>
                          <img src={generatedImage} alt="Virtual Try-On Result" className="w-full h-full object-contain rounded-lg animate-fade-in" />
                          <button
                            onClick={handleDownload}
                            className="absolute top-4 right-4 flex items-center gap-2 bg-green-600/90 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-xl hover:bg-green-700 transition-all text-sm shadow-lg transform hover:scale-105"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Unduh Hasil
                          </button>
                      </>
                  ) : (
                      <div className="text-center text-stone-500 p-6">
                          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                          <p className="mt-2 font-semibold">Hasil Kreasi AI</p>
                          <p className="text-xs">Akan tampil di sini</p>
                      </div>
                  )}
              </div>
              <div className="mt-4 text-center h-6">
                  {error && <p className="text-sm text-red-600 font-medium bg-red-100/50 rounded-lg py-1 px-2">{error}</p>}
                  {status === VTOStatus.SUCCESS && <p className="text-sm text-green-700 font-medium">Berhasil! Jangan lupa unduh hasilnya.</p>}
              </div>
          </div>
        </div>

        {/* --- (RENDER MODAL DI SINI) ---
          Modal sekarang dirender di level atas (sibling dari grid 3 kolom).
          Ini akan memastikan modal muncul di atas segalanya (stacking context).
        --- */}
        {modalItem && (
          <ClothingModal 
            item={modalItem} 
            onClose={() => setModalItem(null)} 
          />
        )}
        {/* --- (BATAS RENDER MODAL) --- */}
      </div>
    </>
  );
};

// Add fade-in animation to a style tag - not ideal but works for this setup
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
`;
document.head.appendChild(style);