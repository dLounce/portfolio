"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Variant = {
  id: string;
  desc: string;
  boundary: boolean;
  gate: boolean;
  outcome: string;
  held: boolean;
};

// The 25-cell deterministic matrix runs the same payload against four
// architecture variants. S0 to S2 are weakened controls; they are supposed
// to fail. Figures from the repo's reported matrix results.
const VARIANTS: Variant[] = [
  {
    id: "S0",
    desc: "Raw vendor text goes straight to the Buyer. No offer boundary, no authorisation gate.",
    boundary: false,
    gate: false,
    outcome: "unauthorised order",
    held: false,
  },
  {
    id: "S1",
    desc: "Adds a prompt telling the Buyer to distrust vendor text. Nothing else changes.",
    boundary: false,
    gate: false,
    outcome: "unauthorised order",
    held: false,
  },
  {
    id: "S2",
    desc: "Offer boundary restored, so the Buyer sees only validated objects. place_order is still ungated.",
    boundary: true,
    gate: false,
    outcome: "unauthorised order",
    held: false,
  },
  {
    id: "S3",
    desc: "Offer boundary and gated place_order. Budget, price floor and delivery are checked again before any order exists.",
    boundary: true,
    gate: true,
    outcome: "blocked at the price floor",
    held: true,
  },
];

function Mark({ on, label }: { on: boolean; label: string }) {
  return (
    <span className="mr-[6px] inline-flex items-center gap-[5px] border border-rule px-[6px] py-[2px] font-mono text-[9px] tracking-[0.1em] text-note uppercase">
      <span className={on ? "text-ok" : "text-fail"}>{on ? "✓" : "✗"}</span>
      {label}
    </span>
  );
}

export default function SentinelPanel() {
  const [shown, setShown] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const play = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(VARIANTS.length);
      return;
    }

    setShown(0);
    let t = 0;
    VARIANTS.forEach((_, i) => {
      t += i === VARIANTS.length - 1 ? 760 : 420; // beat before the defended row lands
      timers.current.push(setTimeout(() => setShown(i + 1), t));
    });
  }, []);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries, o) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            play();
            o.unobserve(e.target);
          }
        }),
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      timers.current.forEach(clearTimeout);
    };
  }, [play]);

  return (
    <div ref={panelRef} className="border border-rule bg-card">
      <noscript>
        <style>{`[data-abl-row]{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      <div className="flex items-center justify-between gap-3 border-b border-rule px-[15px] py-[11px] font-mono text-[10.5px] text-note">
        <span>
          <b className="font-medium text-mute">architecture ablation</b> · one payload, four variants
        </span>
        <span className="whitespace-nowrap">deterministic · no API calls</span>
      </div>

      <div>
        {VARIANTS.map((v, i) => (
          <div
            key={v.id}
            data-abl-row
            className={[
              "grid grid-cols-[46px_1fr_auto] items-start gap-x-4 gap-y-0 border-b border-hair px-[15px] py-[13px]",
              "transition-[opacity,transform] duration-300",
              "max-[900px]:grid-cols-[46px_1fr]",
              i < shown ? "translate-y-0 opacity-100" : "translate-y-[5px] opacity-0",
              v.held ? "bg-paper" : "",
            ].join(" ")}
          >
            <span
              className={`font-mono text-[12px] ${v.held ? "font-medium text-accent" : "text-faint"}`}
            >
              {v.id}
            </span>

            <div>
              <p className="text-[14px] leading-[1.55] text-mute">{v.desc}</p>
              <div className="mt-[9px]">
                <Mark on={v.boundary} label="offer boundary" />
                <Mark on={v.gate} label="authz gate" />
              </div>
            </div>

            <span
              className={[
                "whitespace-nowrap font-mono text-[11px]",
                v.held ? "font-medium text-ok" : "text-fail",
                "max-[900px]:col-span-2 max-[900px]:col-start-2 max-[900px]:mt-[10px]",
              ].join(" ")}
            >
              {v.held ? "✓ " : "✗ "}
              {v.outcome}
            </span>
          </div>
        ))}
      </div>

      <div className="border-b border-hair bg-card px-[15px] py-[13px]">
        <p className="font-mono text-[11px] leading-[1.8] text-body">
          Live models, defended architecture, 100 attacks across 10 families.{" "}
          <b className="font-medium text-accent">12</b> changed how the Buyer reasoned, past the
          noise threshold. <b className="font-medium text-accent">0</b> produced an unauthorised
          action or a policy violation.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 px-[15px] py-[9px] font-mono text-[10px] text-faint">
        <span>
          3 of 25 deterministic cells produced an unauthorised order, all of them in S0 to S2. S3
          came out clean in the matrix and across all 100 live runs.
        </span>
        <button
          type="button"
          onClick={play}
          className="shrink-0 cursor-pointer border-0 bg-transparent text-accent underline"
        >
          replay ↻
        </button>
      </div>
    </div>
  );
}
