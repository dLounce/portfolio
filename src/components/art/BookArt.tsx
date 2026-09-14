"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Seven answers marked, five agreeing and two not: 71.4%, which is the
// benchmark figure. If that number ever changes, change these marks too.
const MARKS: { y: number; ok: boolean }[] = [
  { y: 78, ok: true },
  { y: 88, ok: true },
  { y: 98, ok: false },
  { y: 108, ok: true },
  { y: 118, ok: true },
  { y: 128, ok: false },
  { y: 138, ok: true },
];

const SLOPE = 0.107; // the right page's top edge falls 12px over 112px

export default function BookArt() {
  const [shown, setShown] = useState(0);
  const ref = useRef<SVGSVGElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const play = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(MARKS.length);
      return;
    }

    setShown(0);
    MARKS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setShown(i + 1), 420 + i * 230));
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries, o) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            play();
            o.unobserve(e.target);
          }
        }),
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      timers.current.forEach(clearTimeout);
    };
  }, [play]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 320 200"
      role="img"
      aria-label="An open book with seven marked answers, five agreeing and two not"
      className="absolute inset-0 h-full w-full"
    >
      <noscript>
        <style>{`[data-mark]{opacity:1!important}`}</style>
      </noscript>

      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* pages */}
        <path d="M48 70 L160 58 L160 152 L48 162 Z" stroke="#14181C" strokeWidth="1" />
        <path d="M272 70 L160 58 L160 152 L272 162 Z" stroke="#14181C" strokeWidth="1" />
        <path d="M160 58 L160 152" stroke="#14181C" strokeWidth="1" />

        {/* left page: the question, suggested not spelled out */}
        {[84, 94, 104].map((y, i) => (
          <path
            key={y}
            d={`M72 ${y + 4} L${146 - i * 18} ${y + 4 - (74 - i * 18) * SLOPE}`}
            stroke="#C9D2DA"
            strokeWidth="1.5"
          />
        ))}

        {/* right page: the answers being marked */}
        {MARKS.map((m) => (
          <path
            key={m.y}
            d={`M178 ${m.y} L252 ${m.y + 74 * SLOPE}`}
            stroke="#C9D2DA"
            strokeWidth="1.5"
          />
        ))}

        {/* the marks themselves */}
        {MARKS.map((m, i) => {
          const cx = 262;
          const cy = m.y + 84 * SLOPE;
          return (
            <g
              key={m.y}
              data-mark
              transform={`translate(${cx} ${cy})`}
              className="transition-opacity duration-300"
              style={{ opacity: i < shown ? 1 : 0 }}
              stroke={m.ok ? "#1B3A5C" : "#8C3B2E"}
              strokeWidth="1.6"
            >
              {m.ok ? (
                <path d="M-4 0 L-1 3.2 L5 -4" />
              ) : (
                <>
                  <path d="M-3.2 -3.2 L3.2 3.2" />
                  <path d="M3.2 -3.2 L-3.2 3.2" />
                </>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
