
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-12">
      <div className="container mx-auto py-6 px-4 text-center text-stone-500">
        <p>&copy; {new Date().getFullYear()} WastraNusa. A showcase of Indonesian heritage with Generative AI.</p>
      </div>
    </footer>
  );
};
