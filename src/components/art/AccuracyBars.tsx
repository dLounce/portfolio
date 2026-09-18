const BARS = [
  { label: "Base", v: 50.6 },
  { label: "SFT", v: 66.6 },
  { label: "GRPO", v: 68.4, tag: "best" },
  { label: "GGUF", v: 66.0, tag: "deployed", accent: true },
];

export default function AccuracyBars() {
  return (
    <figure className="my-[26px]">
      <div className="rounded-[6px] border border-rule bg-card p-[20px]">
        <div className="mb-[16px] flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="font-mono text-[11px] tracking-[0.12em] text-note uppercase">
            Overall execution accuracy
          </span>
          <span className="font-mono text-[11px] text-note">deployed model · 15 GB → 4.4 GB</span>
        </div>
        <div className="flex items-end gap-[16px] border-b border-rule">
          {BARS.map((b) => (
            <div key={b.label} className="flex h-[150px] flex-1 flex-col items-center justify-end">
              <span
                className={`mb-[6px] font-mono text-[12.5px] tabular-nums ${
                  b.accent ? "font-medium text-accent" : "text-ink"
                }`}
              >
                {b.v.toFixed(1)}
              </span>
              <div
                className={`w-full max-w-[56px] rounded-t-[2px] ${b.accent ? "bg-accent" : "bg-mute"}`}
                style={{ height: `${b.v}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-[9px] flex gap-[16px]">
          {BARS.map((b) => (
            <div key={b.label} className="flex flex-1 flex-col items-center gap-[2px]">
              <span className="font-mono text-[11.5px] text-body">{b.label}</span>
              {b.tag && (
                <span
                  className={`font-mono text-[10.5px] tracking-[0.1em] uppercase ${
                    b.accent ? "text-accent" : "text-note"
                  }`}
                >
                  {b.tag}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-[9px] font-mono text-[11px] leading-[1.7] text-note">
        Overall EX on 1,600 held-out questions. Bars start at zero. The deployed model is the
        quantized SFT (GGUF Q4_K_M) at 66.0 — 0.6 points under SFT, 4.4 GB instead of about 15 GB.
      </figcaption>
    </figure>
  );
}
