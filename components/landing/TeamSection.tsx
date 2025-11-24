// components/landing/TeamSection.tsx
import React from 'react';
import { TeamMemberCard } from '../TeamMemberCard';

// Pindahkan import gambar ke sini, karena cuma section ini yang butuh
import Arel from '@/public/founders-photo/arel.png';
import Faruq from '@/public/founders-photo/faruq.png';
import Kunk from '@/public/founders-photo/kunk.png';
import Mbak from '@/public/founders-photo/mbak.png';
import Reciii from '@/public/founders-photo/reciii.png';

export const TeamSection = () => (
  <section id="team" className="py-24 px-4 bg-white" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d3c5b4' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}>
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
);