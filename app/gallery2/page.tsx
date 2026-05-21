"use client";

import { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { DarkModeContext } from "../ClientProviders";

const COLORS = ["#ff0080", "#00ffff", "#ffff00", "#ff6600", "#00ff88", "#bf00ff", "#ff3333", "#0099ff"];

function PlantsScatter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    fetch("/images/plants.svg")
      .then((r) => r.text())
      .then((svg) => {
        const responsive = svg.replace("<svg", '<svg style="width:100%;height:auto"');
        setSvgContent(responsive);
      });
  }, []);

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    const elements = Array.from(
      containerRef.current.querySelectorAll("path, circle, rect, ellipse, polygon, polyline")
    ) as SVGElement[];

    // scatter + colorize instantly
    elements.forEach((el) => {
      const rx = (Math.random() - 0.5) * window.innerWidth * 2.5;
      const ry = (Math.random() - 0.5) * window.innerHeight * 2.5;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      el.style.transition = "none";
      el.style.transform = `translate(${rx}px, ${ry}px)`;
      el.style.opacity = "0";
      el.style.fill = color;
    });

    // fly home and restore original color with stagger
    requestAnimationFrame(() => {
      elements.forEach((el, i) => {
        setTimeout(() => {
          el.style.transition = `transform 2.5s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 1s ease-out, fill 2s ease-out`;
          el.style.transform = `translate(0px, 0px)`;
          el.style.opacity = "1";
          el.style.fill = "";
        }, i * 6);
      });
    });
  }, [svgContent]);

  return (
    <div
      ref={containerRef}
      className="w-full"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

export default function Gallery2() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={`h-screen overflow-hidden flex flex-col items-center justify-center w-full ${darkMode ? "bg-[#210E4A]" : "bg-[#F4E5FB]"}`}>
      <Navbar />
      <PlantsScatter />
    </div>
  );
}
