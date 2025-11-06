import React from 'react';
import { Header } from './Header';
import Arel from '@/public/founders-photo/arel.png';
import Faruq from '@/public/founders-photo/faruq.png';
import Kunk from '@/public/founders-photo/kunk.png';
import Mbak from '@/public/founders-photo/mbak.png';
import Reciii from '@/public/founders-photo/reciii.png';
import { Footer } from './Footer';

interface LandingPageProps {
  onStart: () => void;
}

// Komponen Card Fitur (DIPERBARUI)
const FeatureCard = ({ icon, title, description }: { icon: React.ReactElement, title: string, description: string }) => (
    <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/30 text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:bg-white">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 text-white mx-auto mb-5 shadow-lg">
            {React.cloneElement(icon, { className: "h-8 w-8" })}
        </div>
        <h3 className="font-display text-2xl font-bold text-stone-900 mb-2">{title}</h3>
        <p className="text-stone-600 text-sm leading-relaxed">{description}</p>
    </div>
);

// Komponen Card Tim (DIPERBARUI)
const TeamMemberCard = ({ name, role, imageUrl }: { name: string, role: string, imageUrl: string }) => (
    <div className="text-center group">
        <div className="relative inline-block">
            <img 
                src={imageUrl} 
                alt={name} 
                className="w-36 h-36 rounded-full object-cover mx-auto shadow-lg border-4 border-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl" 
            />
        </div>
        <h4 className="mt-5 font-bold text-xl text-stone-800">{name}</h4>
        <p className="text-amber-800 font-semibold">{role}</p>
    </div>
);

// Komponen "Step" untuk Section Cara Kerja (BARU)
const StepCard = ({ number, icon, title, description }: { number: string, icon: React.ReactElement, title: string, description: string }) => (
  <div className="relative bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/50 transition-all duration-300 hover:-translate-y-1">
    <div className="absolute -top-4 -left-4 w-16 h-16 flex items-center justify-center bg-gradient-to-br from-amber-700 to-amber-900 text-white font-display text-3xl font-bold rounded-2xl shadow-lg transform -rotate-12">
      {number}
    </div>
    <div className="mt-12 mb-4 text-amber-800">
      {React.cloneElement(icon, { className: "h-12 w-12" })}
    </div>
    <h3 className="font-display text-2xl font-bold text-stone-900 mb-2">{title}</h3>
    <p className="text-stone-600 text-sm">{description}</p>
  </div>
);

// Heroicons (BARU - untuk ikon)
const IconUpload = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>;
const IconSparkles = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 15.187l-1.011.083.084-1.011L9.813 15.904Zm.074-1.197.828.828-1.011.083.084-1.011.1-.1ZM11.187 15l.828.828-1.011.083.084-1.011L11.187 15Zm.074-1.197.828.828-1.011.083.084-1.011.1-.1ZM12.56 13.096l.828.828-1.011.083.084-1.011L12.56 13.096Zm.074-1.197.828.828-1.011.083.084-1.011.1-.1ZM13.932 10.39l.828.828-1.011.083.084-1.011L13.932 10.39Zm.074-1.197.828.828-1.011.083.084-1.011.1-.1ZM15.305 7.684l.828.828-1.011.083.084-1.011L15.305 7.684Zm.074-1.197.828.828-1.011.083.084-1.011.1-.1ZM16.678 4.977l.828.828-1.011.083.084-1.011L16.678 4.977Zm.074-1.197.828.828-1.011.083.084-1.011.1-.1ZM18.05 2.27l.828.828-1.011.083.084-1.011L18.05 2.27Zm.074-1.197.828.828-1.011.083.084-1.011.1-.1ZM12 21a9 9 0 1 1-9-9 9 9 0 0 1 9 9Z" /></svg>;
const IconDownload = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
const IconAi = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const IconMap = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657 13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /></svg>;
const IconCamera = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" /></svg>;
const IconWorld = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9V3m-9 9h18" /></svg>;
const IconArrowRight = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    return (
        <div className="bg-stone-50 text-stone-800 antialiased">

            <Header onNavigate={onStart} currentView="map" />

            {/* Hero Section */}
<section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-16">

  {/* VIDEO BACKGROUND */}
  <video
  ref={(el) => {
    if (el) el.playbackRate = 0.9;
  }}
  className="absolute inset-0 w-full h-full object-cover z-0"
  src="/video-cover.webm"
  autoPlay
  loop
  muted
  playsInline
/>

  {/* OVERLAY GELAP */}
  <div className="absolute inset-0 bg-black/70 z-10"></div>

  {/* Konten Hero */}
  <div className="relative z-20 px-4 py-16">
    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl">
      <span className="font-semibold text-amber-300 uppercase tracking-widest animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
        Selamat Datang di WastraNusa
      </span>
      
      <h1 className="font-display text-5xl md:text-7xl font-bold text-white drop-shadow-xl my-4 animate-fade-in-down">
        Pesona Budaya, Sentuhan Teknologi
      </h1>
      
      <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-stone-200 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        Jelajahi, pelajari, dan kenakan warisan adiluhung bangsa secara virtual.
      </p>
      
      <button 
        onClick={onStart} 
        className="mt-10 px-10 py-4 bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold text-lg rounded-full shadow-lg hover:from-amber-600 hover:to-amber-800 transition-all duration-300 transform hover:scale-105 hover:shadow-amber-400/50 animate-glow flex items-center justify-center mx-auto"
      >
        Mulai Jelajahi
        <IconArrowRight />
      </button>
    </div>
  </div>
</section>


            {/* About Section (DIPERBARUI) */}
            <section id="about" className="py-24 px-4 bg-white">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        {/* Kolom Teks */}
                        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <span className="font-semibold text-amber-800 uppercase tracking-widest">Mengenal WastraNusa</span>
                            <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-900 my-4">Jembatan Digital Warisan Bangsa</h2>
                            <p className="text-lg text-stone-700 leading-relaxed mb-6">
                                WastraNusa adalah sebuah jembatan digital yang menghubungkan kekayaan budaya Indonesia dengan teknologi masa depan. Misi kami adalah melestarikan dan memperkenalkan Pakaian Adat Nusantara kepada dunia melalui pengalaman virtual try-on yang interaktif dan edukatif.
                            </p>
                            <p className="text-lg text-stone-700 leading-relaxed">
                                Melalui pengalaman virtual try-on berbasis AI, kami menghadirkan cara baru untuk mengenakan, memahami, 
                                dan merayakan pakaian adat. Sebuah ajakan untuk menjaga agar warisan budaya tidak hanya diingat, 
                                tetapi terus hidup dan dikenakan kembali.
                            </p>
                        </div>
                        {/* Kolom Gambar (Ganti src-nya!) */}
                        <div className="animate-fade-in-up">
                            <div className="relative w-full h-80 md:h-[400px] rounded-2xl overflow-hidden shadow-xl">
                                <video
                                ref={(el) => {
                                    if (el) el.playbackRate = 0.9;
                                }}
                                className="absolute inset-0 w-full h-full object-cover"
                                src="/video-about.webm"
                                autoPlay
                                loop
                                muted
                                playsInline
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section (BARU) */}
            <section id="how-it-works" className="py-24 px-4 bg-stone-100/70" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d3c5b4' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}>
              <div className="container mx-auto text-center max-w-5xl">
                <span className="font-semibold text-amber-800 uppercase tracking-widest">Cara Kerja</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-900 mb-16">Semudah 1-2-3</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <StepCard
                    number="1"
                    icon={<IconUpload />}
                    title="Unggah Foto Anda"
                    description="Ambil foto selfie atau unggah foto potret Anda dengan pose menghadap depan."
                  />
                  <StepCard
                    number="2"
                    icon={<IconSparkles />}
                    title="Pilih Pakaian Adat"
                    description="Jelajahi koleksi WastraNusa dari 38 provinsi dan pilih pakaian yang ingin Anda coba."
                  />
                  <StepCard
                    number="3"
                    icon={<IconDownload />}
                    title="Nikmati Hasil AI"
                    description="AI kami akan 'memakaikan' baju adat ke foto Anda secara realistis. Unduh dan bagikan!"
                  />
                </div>
              </div>
            </section>

            {/* Features Section (DIPERBARUI) */}
            <section id="features" className="py-24 px-4 bg-white">
                 <div className="container mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="font-semibold text-amber-800 uppercase tracking-widest">Fitur Unggulan</span>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-900 my-4">Mengapa WastraNusa?</h2>
                        <p className="text-lg text-stone-700 leading-relaxed">
                            Kami menggabungkan teknologi terkini dengan kekayaan budaya untuk memberikan pengalaman yang tak terlupakan.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard 
                            icon={<IconAi />}
                            title="Virtual Try-On Berbasis AI"
                            description="Kenakan pakaian adat dari berbagai suku secara digital dengan hasil yang realistis."
                        />
                        <FeatureCard 
                            icon={<IconMap />}
                            title="Eksplorasi Peta Budaya"
                            description="Pelajari filosofi dan sejarah di balik setiap Wastra melalui peta interaktif Nusantara."
                        />
                        <FeatureCard 
                            icon={<IconCamera />}
                            title="Interaktif & Personal"
                            description="Cukup unggah foto atau gunakan kamera, AI kami akan menyesuaikan pakaian secara otomatis."
                        />
                        <FeatureCard 
                            icon={<IconWorld />}
                            title="Pelestarian Digital"
                            description="Menghubungkan generasi muda dengan warisan budaya luhur melalui platform modern."
                        />
                    </div>
                 </div>
            </section>

            {/* Team Section (DIPERBARUI) */}
            <section id="team" className="py-24 px-4 bg-stone-100/70" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d3c5b4' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}>
                <div className="container mx-auto text-center">
                    <span className="font-semibold text-amber-800 uppercase tracking-widest">Tim Kami</span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-900 mb-16">Di Balik WastraNusa</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
                        <TeamMemberCard name="Reqi Jumantara Hapid" role="Project Manager" imageUrl={Reciii} />
                        <TeamMemberCard name="Wardah Aulia Azzahra" role="Data & Culture Researcher" imageUrl={Mbak} />
                        <TeamMemberCard name="Umar Faruq Robbany" role="Lead Developer" imageUrl={Faruq} />
                        <TeamMemberCard name="Farrel Zandra" role="AI Engineer" imageUrl={Arel} />
                        <TeamMemberCard name="Banteng Harisantoso" role="UI/UX Designer" imageUrl={Kunk} />
                    </div>
                </div>
            </section>

            {/* Footer (DIPERBARUI) */}
            <Footer />
            
            {/* Animasi CSS (Sama seperti sebelumnya, plus 'fadeIn') */}
            <style>{`
                html {
                  scroll-behavior: smooth;
                }
                @keyframes fadeInDown {
                    0% { opacity: 0; transform: translateY(-20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fadeInDown 1s ease-out forwards;
                    opacity: 0;
                }
                @keyframes fadeInUp {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 1s ease-out forwards;
                    opacity: 0;
                }
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fadeIn 1s ease-out forwards;
                    opacity: 0;
                }
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 10px rgba(245, 158, 11, 0.4), 0 0 20px rgba(245, 158, 11, 0.3); }
                    50% { box-shadow: 0 0 25px rgba(245, 158, 11, 0.6), 0 0 40px rgba(245, 158, 11, 0.4); }
                }
                .animate-glow {
                    animation: glow 3s ease-in-out infinite 1s;
                }
            `}</style>
        </div>
    );
};