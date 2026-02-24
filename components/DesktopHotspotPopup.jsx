"use client"
export default function DesktopHotspotPopup({ hotspot, onClose, darkMode, position }) {
  if (!hotspot) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -50%)",
        zIndex: 40,
      }}
      className={`max-w-[200px] md:max-w-[220px] lg:max-w-[240px] xl:max-w-[260px] w-full p-3 md:p-4 rounded-xl shadow-2xl border-2 animate-fadeIn
        ${
          darkMode
            ? "bg-[#210E4A]/98 border-[#65F0CD]/40 text-white"
            : "bg-white/98 border-[#210E4A]/40 text-[#210E4A]"
        }`}
    >
      <button
        onClick={onClose}
        className={`absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs md:text-sm font-bold
          transition-all duration-200 hover:scale-110 shadow-lg
          ${
            darkMode
              ? "bg-[#65F0CD] text-[#210E4A] hover:bg-[#4FD4B3]"
              : "bg-[#210E4A] text-white hover:bg-[#2D1260]"
          }`}
        aria-label="Close popup"
      >
        ×
      </button>

      <h3 className={`text-base md:text-lg lg:text-xl font-bold mb-2 ${darkMode ? "text-[#65F0CD]" : "text-[#210E4A]"}`}>
        {hotspot.title}
      </h3>

      <p className={`text-xs md:text-sm lg:text-base leading-relaxed ${darkMode ? "text-white/90" : "text-[#210E4A]/90"}`}>
        {hotspot.content}
      </p>
    </div>
  );
}
