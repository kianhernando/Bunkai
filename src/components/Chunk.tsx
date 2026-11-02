"use client";

import { useState } from "react";

const colors: Record<string, string> = {
  名詞: "#F4B860",
  助詞: "#2F5FC4",
  動詞: "#E06A4F",
  助動詞: "#F2A08C",
  形容詞: "#7CC4A8",
  記号: "#D1D5DB",
};

const labels: Record<string, string> = {
  名詞: "Noun",
  助詞: "Particle",
  動詞: "Verb",
  助動詞: "Auxiliary",
  形容詞: "Adjective",
  記号: "Symbol",
};

type ChunkProps = {
  text: string;
  reading: string;
  pos: string;
  hint: string;
};

export default function Chunk({ text, reading, pos, hint }: ChunkProps) {
  const [hovered, setHovered] = useState(false);

  const backgroundColor = colors[pos] ?? "#E5E7EB";
  const textColor = pos === "助詞" ? "#FFFFFF" : "#1B1D22";
  const label = labels[pos] ?? pos;

  return (
    <span
      className="relative inline-flex flex-col items-center gap-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-xs text-gray-500">{reading}</span>
      <span
        className="rounded px-3 py-2 text-2xl cursor-pointer"
        style={{ backgroundColor, color: textColor }}
      >
        {text}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-gray-500">{label}</span>
      {hovered && (
        <span className="absolute top-full left-0 mt-2 w-40 bg-gray-900 text-white text-sm rounded p-2 z-10">
          {hint}
        </span>
      )}
    </span>
  );
}