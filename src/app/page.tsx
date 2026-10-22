"use client";

import { useState } from "react";
import Chunk from "@/components/Chunk";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string[]>([]);

  async function handleClick() {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });
    const data = await response.json();
    setResult(data.words);
  }

  return (
    <main className="p-8 flex flex-col gap-4 max-w-xl">
      <textarea
        className="border rounded p-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="bg-black text-white rounded p-2" onClick={handleClick}>
        Break it down
      </button>
      <div className="flex flex-wrap gap-2">
        {result.map((char, index) => (
          <Chunk key={index} text={char} hint={`Character #${index + 1}`} />
        ))}
      </div>
    </main>
  );
}