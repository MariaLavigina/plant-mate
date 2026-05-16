export const pageBg = (darkMode: boolean) =>
  `transition-colors duration-500 ${
    darkMode
      ? "bg-gradient-to-b from-[#210E4A] to-[#5A1B27]"
      : "bg-gradient-to-b from-[#F4FBF0] via-[#E8F2E2] to-[#C8DEBA]"
  }`;

export const primaryText = (darkMode: boolean) =>
  darkMode ? "text-white" : "text-[#1E3D2A]";

export const accentText = (darkMode: boolean) =>
  darkMode ? "text-[#65F0CD]" : "text-[#210E4A]";

export const primaryButton = (darkMode: boolean) =>
  darkMode
    ? "bg-[#65F0CD] border-[#65F0CD] text-[#210E4A] hover:bg-[#4FD4B3] hover:border-[#4FD4B3]"
    : "bg-[#210E4A] border-[#210E4A] text-[#65F0CD] hover:bg-[#2D1260]";

export const accentBar = (darkMode: boolean) =>
  `h-[3px] w-full ${
    darkMode
      ? "bg-gradient-to-r from-[#65F0CD] via-[#4FD4B3] to-[#65F0CD]/40"
      : "bg-gradient-to-r from-[#2D6A4F] via-[#4CAF82] to-[#2D6A4F]/40"
  }`;

export const accentLine = (darkMode: boolean) =>
  `w-8 h-[2px] rounded-full ${darkMode ? "bg-[#65F0CD]/35" : "bg-[#2D6A4F]/30"}`;

export const popoverShadow = (darkMode: boolean) =>
  darkMode
    ? "0 24px 60px rgba(101,240,205,0.15), 0 8px 32px rgba(0,0,0,0.5)"
    : "0 24px 60px rgba(30,61,42,0.12), 0 12px 40px rgba(0,0,0,0.18)";
