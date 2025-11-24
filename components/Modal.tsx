import React from "react";

export const Modal = ({
    open,
    onClose,
    children,
    }: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
        <div className="bg-white rounded-2xl max-w-[80rem] w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-xl">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="
                    absolute top-4 right-4 
                    w-10 h-10 flex items-center justify-center 
                    bg-white text-stone-500 rounded-full shadow-md 
                    hover:text-white hover:bg-amber-700 
                    transition-all duration-300 transform hover:rotate-180
                    focus:outline-none
                "
            >
            ✕
            </button>

            {children}
        </div>
        </div>
    );
};
