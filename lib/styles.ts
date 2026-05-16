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
