import Navbar from "../../components/Navbar";
import { useContext } from "react";
import { DarkModeContext } from "../layout"; // adjust path if needed

export default function About() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const textColor = darkMode ? "text-white" : "text-[#210E4A]";

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-b from-[#210E4A] to-[#5A1B27]"
          : "bg-gradient-to-b from-[#A75B2B] to-[#F4E5FB]"
      }`}
    >
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Main container */}
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 gap-12 px-2 sm:px-4 md:px-6">
        
        {/* Title */}
        <h1
          className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${textColor} mb-6 font-caveat text-center`}
        >
          About Me
        </h1>

        {/* Content Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-[90%]">
          
          {/* Left Side - Text */}
          <div
            className={`${textColor} space-y-4 md:w-1/2`}
            style={{ fontSize: 'clamp(1rem, 1.8vw, 1.125rem)' }} // fluid text sizing
          >
            <p>Hello! My name is Maria, and I love plants… and coding of course! </p>
            <p>
             I created this website for people searching for their perfect plant companion - the one that will actually survive and thrive with you. 
            </p>
            <p>
             We all need a little help finding the plant that fits our lifestyle, and that’s exactly what this app does: it tells you who your perfect plant match is. 
            </p>
            <p>
             A little about me: my biggest plant is almost 2.5 meters tall! It’s a Euphorbia Trigona Cactus, and it just keeps growing and growing… I guess there’s no escaping IKEA or any plant shop without bringing home a new green friend. 
            </p>
            <p>
              Why do we love plants so much? Honestly, I’m not sure, but I do know that plants make life better. Studies say they can even reduce anxiety and stress, and I can totally believe it - I feel calmer and happier surrounded by greenery every day. 
            </p>
            <p>
             Here’s a photo of me with flowers projected on my face, because why not?
            </p>
          </div>

          {/* Right Side - Image */}
          <div className=" flex justify-center">
            <img
              src="/images/placeholder-image.svg"
              alt="Placeholder"
              className="w-full h-auto max-h-96"
            />
          </div>
        </div>
      </div>
    </div>
  );
}