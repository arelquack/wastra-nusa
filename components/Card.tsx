import React from "react";

export const StepCard = ({
  number,
  image,
  title,
  description,
}: {
  number: string;
  image?: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="relative bg-[#F8EFE7] border border-[#C99A72] rounded-2xl p-6 shadow-sm">
      {/* Nomor */}
      <div className="absolute -top-4 -left-2 w-10 h-10 bg-amber-800 text-white rounded-full flex items-center justify-center text-lg font-semibold">
        {number}
      </div>

      {/* Ilustrasi */}
      {image && <div className="mb-4 flex justify-start">{image}</div>}

      {/* Garis tipis */}
      <div className="h-px bg-[#C99A72] w-full mb-3"></div>

      {/* Judul */}
      <h3 className="text-stone-900 font-bold text-lg mb-1 text-center">
        {title}
      </h3>

      {/* Deskripsi */}
      <p className="text-stone-600 text-sm leading-relaxed text-center">
        {description}
      </p>
    </div>
  );
};
