function Box({ title, sub, tone }: { title: string; sub?: string; tone?: "fail" | "accent" }) {
  const border =
    tone === "fail" ? "border-fail/45" : tone === "accent" ? "border-accent" : "border-rule";
  return (
    <div className={`flex-1 rounded-[5px] border ${border} bg-paper px-[12px] py-[10px]`}>
      <div className="font-mono text-[12px] text-ink">{title}</div>
      {sub && <div className="mt-[3px] font-mono text-[10.5px] leading-[1.45] text-note">{sub}</div>}
    </div>
  );
}

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 rotate-90 items-center justify-center self-center font-mono text-[15px] text-note min-[600px]:rotate-0"
    >
      →
    </span>
  );
}

export default function SentinelDiagram() {
  return (
    <figure className="my-[26px]">
      <div className="rounded-[6px] border border-rule bg-card p-[18px]">
        <div className="mb-[8px] font-mono text-[11px] tracking-[0.12em] text-note uppercase">
          reads untrusted text · cannot act
        </div>
        <div className="flex flex-col items-stretch gap-[10px] min-[600px]:flex-row min-[600px]:items-center">
          <Box title="Untrusted vendor text" sub="free-form messages" tone="fail" />
          <Arrow />
          <Box title="Interpreter" sub="no tools · no network" />
        </div>

        <div className="my-[14px] flex flex-col items-center gap-[5px] rounded-[5px] border border-accent bg-paper px-[12px] py-[11px] text-center">
          <span className="font-mono text-[12px] text-accent">
            VendorOffer — typed, validated (additionalProperties: false)
          </span>
          <span className="font-mono text-[11px] text-note">
            the only thing that crosses to the Buyer; free text never does
          </span>
        </div>

        <div className="mb-[8px] font-mono text-[11px] tracking-[0.12em] text-note uppercase">
          acts · never sees the text
        </div>
        <div className="flex flex-col items-stretch gap-[10px] min-[600px]:flex-row min-[600px]:items-center">
          <Box title="Buyer" sub="emits BuyerDecision — accept · counter · reject · walk_away" />
          <Arrow />
          <Box title="Authorization gates" sub="budget · price floor · flags · delivery — no model" tone="accent" />
          <Arrow />
          <Box title="place_order" sub="re-runs the gates itself" />
        </div>
      </div>
      <figcaption className="mt-[9px] font-mono text-[11px] leading-[1.7] text-note">
        Isolation is process, credential and network separation, not prompt wording. The layer that
        can place an order never reads vendor text, and the gates that authorise it contain no model.
      </figcaption>
    </figure>
  );
}
