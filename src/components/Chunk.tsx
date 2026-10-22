"use client";

import { useState } from "react";

type ChunkProps = {
    text: string;
    hint: string;
    reading: string;
};

export default function Chunk({ text, hint, reading }: ChunkProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <span
            className="relative inline-flex flex-col items-center gap-1"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span className="text-xs text-gray-500">{reading}</span>
            <span className="bg-amber-300 rounded px-3 py-2 text-2xl cursor-pointer">{text}</span>
            {hovered && (
                <span className="absolute top-full left-0 mt-2 w-40 bg-gray-900 text-white text-sm rounded p-2 z-10">
                    {hint}
                </span>
            )}
        </span>
    );
}