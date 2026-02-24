"use client"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import plants from "../data/plants.json";

export default function DevPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Only show if dev panel is explicitly enabled via environment variable
  if (import.meta.env.VITE_DEV_PANEL !== "true") return null;

  const goToPlantResult = (plantId) => {
    // Create fake quiz answers that will match this plant
    const selectedAnswers = {
      1: "a1", // Just dummy data
      2: "a2",
    };

    // Navigate to results with the specific plant
    navigate("/results", {
      state: {
        selectedAnswers,
        devPlantId: plantId // Pass the specific plant we want to see
      }
    });
    // Keep panel open so they can switch between plants
  };

  return (
    <>
      {/* Floating Dev Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-[100] w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center font-bold text-xl transition-all duration-200 hover:scale-110"
        title="Dev Panel - Quick Plant Preview"
      >
        🌿
      </button>

      {/* Right Side Panel */}
      {isOpen && (
        <div className="fixed right-0 top-0 h-screen w-64 bg-white shadow-2xl z-[99] border-l-2 border-purple-600">
          {/* Header */}
          <div className="bg-purple-600 text-white p-3 flex justify-between items-center">
            <h2 className="text-sm font-bold">🛠️ Dev Panel</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center text-lg"
            >
              ✕
            </button>
          </div>

          {/* Plant List */}
          <div className="p-3 overflow-y-auto h-[calc(100vh-52px)]">
            <div className="space-y-1">
              {plants.map((plant) => (
                <button
                  key={plant.id}
                  onClick={() => goToPlantResult(plant.id)}
                  className="w-full text-left p-2 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-400 rounded transition-all duration-150"
                >
                  <div className="text-xs font-semibold text-gray-800">
                    #{plant.id} {plant.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
