export default function ThesisGeometry() {
  return (
    <figure className="my-[24px]">
      <div className="grid gap-[16px] rounded-[6px] border border-rule bg-card p-[18px] min-[600px]:grid-cols-2">
        <div>
          <svg
            viewBox="0 0 210 156"
            className="w-full"
            role="img"
            aria-label="The two task vectors sit almost on top of the shared instruction-tuning vector, so sign conflict is near zero."
          >
            <defs>
              <marker id="tg-note" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" className="fill-note" />
              </marker>
              <marker id="tg-acc" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" className="fill-accent" />
              </marker>
            </defs>
            <line x1="26" y1="130" x2="172" y2="44" className="stroke-note" strokeWidth="2.4" markerEnd="url(#tg-note)" />
            <line x1="26" y1="130" x2="178" y2="40" className="stroke-accent" strokeWidth="1.5" markerEnd="url(#tg-acc)" />
            <line x1="26" y1="130" x2="166" y2="56" className="stroke-accent" strokeWidth="1.5" markerEnd="url(#tg-acc)" />
            <circle cx="26" cy="130" r="2.5" className="fill-ink" />
            <text x="150" y="32" className="fill-note font-mono" fontSize="9">θ shared</text>
            <text x="120" y="74" className="fill-accent font-mono" fontSize="9">τ₁, τ₂</text>
          </svg>
          <p className="mt-[6px] font-mono text-[10.5px] leading-[1.5] text-note">
            Each task vector is the shared instruction-tuning shift plus a small residual, so both
            point almost the same way. <span className="text-body">Sign conflict 0.000.</span>
          </p>
        </div>
        <div>
          <svg
            viewBox="0 0 210 156"
            className="w-full"
            role="img"
            aria-label="After the shared vector is removed, the two residuals point in clearly different directions."
          >
            <defs>
              <marker id="tg-acc2" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" className="fill-accent" />
              </marker>
            </defs>
            <line x1="26" y1="130" x2="160" y2="76" className="stroke-accent" strokeWidth="1.7" markerEnd="url(#tg-acc2)" />
            <line x1="26" y1="130" x2="98" y2="34" className="stroke-accent" strokeWidth="1.7" markerEnd="url(#tg-acc2)" />
            <circle cx="26" cy="130" r="2.5" className="fill-ink" />
            <text x="150" y="72" className="fill-accent font-mono" fontSize="9">r₁</text>
            <text x="88" y="28" className="fill-accent font-mono" fontSize="9">r₂</text>
          </svg>
          <p className="mt-[6px] font-mono text-[10.5px] leading-[1.5] text-note">
            SC-TIES subtracts the shared shift first, then merges the residuals, which now disagree.{" "}
            <span className="text-body">Sign conflict 0.237.</span>
          </p>
        </div>
      </div>
      <figcaption className="mt-[9px] font-mono text-[11px] leading-[1.7] text-note">
        Why TIES behaved like averaging here: the instruction-tuning anchor dwarfs each LoRA signal,
        so sign election has almost nothing to arbitrate until the anchor is removed.
      </figcaption>
    </figure>
  );
}
