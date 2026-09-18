"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Kind = "plain" | "fail" | "ok" | "fix";

const KIND_CLASS: Record<Kind, string> = {
  plain: "text-body",
  fail: "text-fail",
  ok: "text-ok",
  fix: "text-accent",
};

// Captured from a real run of log2agent's inject-bug demo on the
// BPI 2020 Request for Payment log. Paths stripped; nothing invented.
const STEPS: { n: string; glyph: string; kind: Kind; text: string }[] = [
  { n: "00", glyph: "✗", kind: "fail", text: "sabotage · result = _stub_n0_submitted_by_employee(stat)" },
  { n: "01", glyph: "→", kind: "plain", text: "CALL run_smoke_test({})" },
  { n: "02", glyph: "✗", kind: "fail", text: "FAIL · NameError: name 'stat' is not defined" },
  { n: "03", glyph: "→", kind: "plain", text: "CALL read_traceback({})" },
  { n: "04", glyph: "→", kind: "plain", text: "CALL read_code({'section': 'n0_submitted_by_employee'})" },
  { n: "05", glyph: "↻", kind: "fix", text: "CALL patch_code({'section': 'n0_submitted_by_employee', ...})" },
  { n: "06", glyph: "↻", kind: "fix", text: "Patched 'n0_submitted_by_employee' successfully." },
  { n: "07", glyph: "→", kind: "plain", text: "CALL run_smoke_test({})" },
  { n: "08", glyph: "✓", kind: "ok", text: "PASS — repaired" },
];

const DIFF_AFTER = 5; // reveal the diff once the patch_code call lands

export default function TracePanel() {
  const [shown, setShown] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const play = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(STEPS.length);
      return;
    }

    setShown(0);
    let t = 0;
    STEPS.forEach((_, i) => {
      t += i === 2 ? 700 : 380; // beat before the failure lands
      timers.current.push(setTimeout(() => setShown(i + 1), t));
    });
  }, []);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    // a missing browser API must never hide the evidence: show everything.
    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(play);
      return;
    }
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

  const diffOpen = shown > DIFF_AFTER;

  return (
    <div ref={panelRef} className="border border-rule bg-card">
      <noscript>
        <style>{`[data-trace-row]{opacity:1!important;transform:none!important}
          [data-trace-diff]{max-height:120px!important;margin:0 15px 13px!important}`}</style>
      </noscript>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-rule px-[15px] py-[11px] font-mono text-[12px] text-note">
        <span>
          <b className="font-medium text-mute">repair_agent_fix</b> · BPI 2020 Request for Payment · recorded run
        </span>
        <span>bounded · 5 iterations / 60s</span>
      </div>

      <div className="font-mono text-[12.5px]">
        {STEPS.map((s, i) => (
          <div key={s.n}>
            <div
              data-trace-row
              className={[
                "grid grid-cols-[34px_16px_1fr] items-start gap-[11px] border-b border-hair px-[15px] py-[9px]",
                "transition-[opacity,transform] duration-300",
                i < shown ? "translate-y-0 opacity-100" : "translate-y-[5px] opacity-0",
              ].join(" ")}
            >
              <span className="text-faint">{s.n}</span>
              <span className={`text-center ${KIND_CLASS[s.kind]}`}>{s.glyph}</span>
              <span className={`min-w-0 [overflow-wrap:anywhere] ${KIND_CLASS[s.kind]}`}>{s.text}</span>
            </div>

            {i === DIFF_AFTER && (
              <div
                data-trace-diff
                className={[
                  "mx-[15px] overflow-hidden transition-[max-height,margin] duration-[400ms]",
                  diffOpen ? "mt-0 mb-[13px] max-h-[120px]" : "my-0 max-h-0",
                ].join(" ")}
              >
                <pre className="border-l-2 border-accent bg-paper px-[13px] py-[11px] font-mono text-[12px] leading-[1.75] text-mute">
                  <span className="text-fail">-   result = _stub_n0_submitted_by_employee(stat)</span>
                  {"\n"}
                  <span className="text-ok">+   result = _stub_n0_submitted_by_employee(state)</span>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-between gap-x-3 gap-y-2 border-t border-hair px-[15px] py-[9px] font-mono text-[11.5px] text-faint">
        <span>1 failure · 1 patch · 0 retries · patch_code replaces the whole function, AST-validated before write</span>
        <button type="button" onClick={play} className="cursor-pointer border-0 bg-transparent text-accent underline">
          replay ↻
        </button>
      </div>
    </div>
  );
}