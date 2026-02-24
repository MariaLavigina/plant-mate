"use client"
export default function Hotspot({ position, onClick, darkMode, isHidden }) {
  if (isHidden) return null;

  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -50%)",
      }}
      className={`group w-10 h-10 md:w-10 lg:w-12 xl:w-14 md:h-10 lg:h-12 xl:h-14 rounded-full border-2 flex items-center justify-center
        transition-all duration-300 hover:scale-110 z-30
        ${
          darkMode
            ? "bg-[#65F0CD]/20 border-[#65F0CD] hover:bg-[#65F0CD]/40 backdrop-blur-sm"
            : "bg-white/30 border-[#210E4A] hover:bg-white/50 backdrop-blur-sm"
        }
        animate-pulse hover:animate-none active:scale-95`}
      aria-label="View plant information"
    >
      <span
        className={`text-2xl md:text-xl lg:text-2xl xl:text-3xl font-bold leading-none ${
          darkMode ? "text-[#65F0CD]" : "text-[#210E4A]"
        }`}
      >
        +
      </span>
    </button>
  );
}
