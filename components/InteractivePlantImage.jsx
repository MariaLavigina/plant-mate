"use client";
import { useState, useEffect } from "react";
import Hotspot from "./Hotspot";
import HotspotPopup from "./HotspotPopup";
import DesktopHotspotPopup from "./DesktopHotspotPopup";

const getPlantImagePath = (plantName) =>
  `/images/plants/${plantName.toLowerCase().replace(/\s+/g, "-")}.png`;

export default function InteractivePlantImage({ plant, className, imageClassName }) {
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!plant) return null;

  return (
    <>
      <div
        className={`relative inline-block ${className}`}
        onClick={(e) => {
          if (isDesktop && selectedHotspot && e.target.tagName === "IMG") {
            setSelectedHotspot(null);
          }
        }}
      >
        <img
          src={getPlantImagePath(plant.name)}
          alt={plant.name}
          onError={(e) => (e.target.src = "/images/plants/placeholder.png")}
          className={`object-contain drop-shadow-2xl block ${imageClassName ?? "w-full h-auto"}`}
        />

        {plant.hotspots?.map((hotspot) => (
          <Hotspot
            key={hotspot.id}
            position={hotspot.position}
            onClick={() => setSelectedHotspot(hotspot)}
            isHidden={selectedHotspot?.id === hotspot.id && isDesktop}
          />
        ))}

        {isDesktop && selectedHotspot && (
          <DesktopHotspotPopup
            hotspot={selectedHotspot}
            position={selectedHotspot.position}
            onClose={() => setSelectedHotspot(null)}
          />
        )}
      </div>

      {!isDesktop && selectedHotspot && (
        <HotspotPopup
          hotspot={selectedHotspot}
          onClose={() => setSelectedHotspot(null)}
        />
      )}
    </>
  );
}
