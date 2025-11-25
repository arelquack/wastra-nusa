import React, { useState } from "react";
import { StepCard } from "./Card";

export const HowToUse = () => {
    const [mode, setMode] = useState<"heritage" | "fusion">("heritage");

    return (
        <section className="w-full flex justify-center">
        <div className="bg-white rounded-3xl w-full">

            {/* Toggle Mode */}
            <div className="text-center mb-10">
            <div className="inline-flex bg-[#E9BD9B]/30 rounded-full px-2 py-1 space-x-1 mb-6">
                <button
                className={`px-6 py-2 rounded-full font-semibold transition-all
                    ${mode === "heritage" ? "bg-[#A35422] text-white" : "text-[#A35422]"}`}
                onClick={() => setMode("heritage")}
                >
                Heritage
                </button>

                <button
                className={`px-6 py-2 rounded-full font-semibold transition-all
                    ${mode === "fusion" ? "bg-[#A35422] text-white" : "text-[#A35422]"}`}
                onClick={() => setMode("fusion")}
                >
                Fusion
                </button>
            </div>

            <p className="text-lg text-stone-700 max-w-3xl mx-auto leading-relaxed">
                {mode === "heritage" ? (
                <>
                    Pada mode <span className="italic">Heritage</span>, Wastra Nusa akan mengolah foto Anda
                    dan menyesuaikannya agar tampil mengenakan pakaian adat terpilih.
                </>
                ) : (
                <>
                    Pada mode <span className="italic">Fusion</span>, Anda dapat menambahkan kreativitas
                    melalui prompt untuk menghasilkan gaya adat yang lebih ekspresif.
                </>
                )}
            </p>
            </div>

            {/* Step Cards */}
            <div
            className={`grid grid-cols-1 md:grid-cols-2 ${
                mode === "heritage" ? "lg:grid-cols-4" : "lg:grid-cols-5"
            } gap-6`}
            >
            {/* Step 1 */}
            <StepCard
                number="1"
                image={
                    <div className="h-20 flex items-center justify-center w-full mb-1">
                        <img src="/assets/peta-indonesia.svg" className="max-h-full max-w-full object-contain" />
                    </div>
                }
                title="Pilih Provinsi Melalui Peta Interaktif"
                description="Gunakan peta interaktif untuk mengeksplor ragam pakaian adat"
            />

            {/* Step 2 */}
            <StepCard
                number="2"
                image={
                    <div className="h-20 flex items-center justify-center w-full mb-1">
                        <img src="/assets/baju.png" className="max-h-full max-w-full object-contain" />
                    </div>
                }
                title="Pilih Pakaian Adat"
                description="Tentukan pakaian adat berdasarkan provinsi terpilih"
            />

            {/* Step 3 */}
            <StepCard
                number="3"
                image={
                    <div className="h-20 flex items-center justify-center w-full mb-1">
                        <img src="/assets/unggah.png" className="max-h-full max-w-full object-contain" />
                    </div>
                }
                title="Unggah Foto Anda"
                description="Unggah foto selfie atau potret dengan pose menghadap depan"
            />

            {/* Fusion has a fourth step */}
            {mode === "fusion" && (
                <StepCard
                number="4"
                image={
                    <div className="h-20 flex items-center justify-center w-full mb-1">
                        <img src="/assets/ai.png" className="max-h-full max-w-full object-contain" />
                    </div>
                }
                title="Tuliskan Prompt Anda"
                description="Salurkan kreativitas Anda dan biarkan AI menangani sisanya"
                />
            )}

            {/* Last Step */}
            <StepCard
                number={mode === "heritage" ? "4" : "5"}
                image={
                    <div className="h-20 flex items-center justify-center w-full mb-1">
                        <img src="/assets/unduh.png" className="max-h-full max-w-full object-contain" />
                    </div>
                }
                title="Nikmati Hasil AI"
                description="AI akan menghasilkan gambar adat terbaik untuk Anda"
            />
            </div>
        </div>
        </section>
    );
};
