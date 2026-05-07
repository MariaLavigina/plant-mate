"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import plants from "../data/plants.json";

export default function DevPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (process.env.NEXT_PUBLIC_DEV_PANEL !== "true") return null;

  const previewPlant = (plant) => {
    router.push(`/results?plantId=${plant.id}&preview=${Date.now()}`);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-[100] px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg font-semibold text-sm transition-all duration-200 hover:scale-105"
      >
        Plant Previews
      </button>

      {isOpen && (
        <div className="fixed right-0 top-0 h-screen w-64 bg-white shadow-2xl z-[99] border-l-2 border-purple-600 flex flex-col">
          <div className="bg-purple-600 text-white p-3 flex justify-between items-center">
            <h2 className="text-sm font-bold">Plant Previews</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <div className="p-3 overflow-y-auto flex-1">
            <p className="text-xs text-gray-400 mb-3">Click a plant to preview its results page</p>
            <div className="space-y-1">
              {plants.map((plant) => (
                <button
                  key={plant.id}
                  onClick={() => previewPlant(plant)}
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
