const BARS = [
  { label: "Baseline prompt", v: 44.1 },
  { label: "Final prompt + retrieval", v: 71.0, accent: true },
];

export default function AgreementBars() {
  return (
    <figure className="my-[26px]">
      <div className="rounded-[6px] border border-rule bg-card p-[20px]">
        <div className="mb-[16px] flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="font-mono text-[11px] tracking-[0.12em] text-note uppercase">
            Agreement with human graders
          </span>
          <span className="font-mono text-[11px] text-accent">+26.9 points</span>
        </div>
        <div className="flex items-end gap-[26px] border-b border-rule">
          {BARS.map((b) => (
            <div key={b.label} className="flex h-[150px] flex-1 flex-col items-center justify-end">
              <span
                className={`mb-[6px] font-mono text-[13px] tabular-nums ${
                  b.accent ? "font-medium text-accent" : "text-ink"
                }`}
              >
                {b.v.toFixed(1)}%
              </span>
              <div
                className={`w-full max-w-[90px] rounded-t-[2px] ${b.accent ? "bg-accent" : "bg-mute"}`}
                style={{ height: `${b.v}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-[9px] flex gap-[26px]">
          {BARS.map((b) => (
            <div key={b.label} className="flex flex-1 justify-center">
              <span className="text-center font-mono text-[11.5px] text-body">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-[9px] font-mono text-[11px] leading-[1.7] text-note">
        Agreement with 118 human-labelled answers, not accuracy. Bars start at zero. Prompt and
        retrieval changes were made together, so the split between them is not measured.
      </figcaption>
    </figure>
  );
}
