"use client";

import { useEffect, useState } from "react";

type Entry = { id: number; ts: string; text: string; ev: number | null };

export default function LogTail({
  lines,
  startEvent,
  label = "sentinel · eval tail",
}: {
  lines: string[];
  /** optional monotone event id rendered as #N. omit it rather than invent one. */
  startEvent?: number;
  label?: string;
}) {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    if (lines.length === 0) return;

    let i = 0;
    let ev = startEvent ?? 0;
    let id = 0;

    const stamp = () => {
      const d = new Date();
      return `${String(d.getMinutes()).padStart(2, "0")}:${String(
        d.getSeconds()
      ).padStart(2, "0")}`;
    };

    const make = (): Entry => ({
      id: id++,
      ts: stamp(),
      text: lines[i++ % lines.length],
      ev: startEvent === undefined ? null : ev++,
    });

    // seed newest-first, bounded to five rows. deliberately client-only: the
    // timestamps would not match a server render and would fail hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(Array.from({ length: 5 }, make).reverse());

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const t = setInterval(
      () => setEntries((prev) => [make(), ...prev].slice(0, 5)),
      3400
    );
    return () => clearInterval(t);
  }, [lines, startEvent]);

  return (
    <div className="mt-auto border-t border-rule pt-3">
      <div className="mb-[7px] flex items-center gap-[7px] font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
        <i className="block h-[5px] w-[5px] animate-blip rounded-full bg-ok" />
        {label}
      </div>
      <ul className="relative h-[76px] list-none overflow-hidden">
        {entries.map((e) => (
          <li
            key={e.id}
            data-tail-line
            className="animate-tailin translate-y-[6px] whitespace-nowrap font-mono text-[9.5px] leading-[1.65] text-faint opacity-0"
          >
            <span className="text-tail">{e.ts}</span> {e.text}
            {e.ev !== null && <span className="text-tail"> #{e.ev}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
