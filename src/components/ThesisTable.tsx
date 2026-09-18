type Row = {
  method: string;
  mmlu: string;
  hella: string;
  gsm: string;
  sign: string;
  sig: ("mmlu" | "hella" | "gsm")[];
  proposed?: boolean;
};

const ROWS: Row[] = [
  { method: "Baseline", mmlu: "0.713", hella: "0.786", gsm: "0.642", sign: "n/a", sig: [] },
  { method: "SM-TIES", mmlu: "0.699", hella: "0.789", gsm: "0.490", sign: "0.221", sig: ["mmlu", "gsm"] },
  { method: "SM-Avg", mmlu: "0.696", hella: "0.787", gsm: "0.468", sign: "n/a", sig: ["mmlu", "gsm"] },
  { method: "CM-TIES", mmlu: "0.706", hella: "0.781", gsm: "0.480", sign: "0.000", sig: ["gsm"] },
  { method: "CMAM", mmlu: "0.705", hella: "0.790", gsm: "0.514", sign: "0.000", sig: ["gsm"] },
  { method: "CM-Avg", mmlu: "0.706", hella: "0.781", gsm: "0.486", sign: "n/a", sig: ["gsm"] },
  { method: "SC-TIES", mmlu: "0.716", hella: "0.786", gsm: "0.452", sign: "0.237", sig: ["gsm"], proposed: true },
  { method: "OP-TIES", mmlu: "0.711", hella: "0.792", gsm: "0.484", sign: "0.414", sig: ["gsm"], proposed: true },
];

const HEAD = ["Method", "MMLU", "HellaSwag", "GSM8K", "Sign conflict"];

function Cell({ v, sig, strong }: { v: string; sig: boolean; strong?: boolean }) {
  return (
    <td className={`border-b border-hair py-[9px] pr-3 ${strong ? "font-medium text-accent" : "text-body"}`}>
      {v}
      {sig && <span className="text-faint"> ★</span>}
    </td>
  );
}

export default function ThesisTable() {
  return (
    <div>
      <div className="overflow-x-auto">
      <table className="w-full min-w-[460px] border-collapse font-mono text-[12px]">
        <caption className="mb-[10px] text-left font-mono text-[11px] tracking-[0.12em] text-note uppercase">
          KD-TIES merge results against baseline · MMLU, HellaSwag, GSM8K, sign conflict
        </caption>
        <thead>
          <tr>
            {HEAD.map((h) => (
              <th key={h} scope="col" className="border-b border-rule pr-3 pb-[9px] text-left font-medium text-[11px] tracking-[0.12em] text-note uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.method}>
              <td className={`border-b border-hair py-[9px] pr-3 ${r.proposed ? "font-medium text-ink" : "text-body"}`}>
                {r.method}
              </td>
              <Cell v={r.mmlu} sig={r.sig.includes("mmlu")} strong={r.method === "SC-TIES"} />
              <Cell v={r.hella} sig={r.sig.includes("hella")} strong={r.method === "OP-TIES"} />
              <Cell v={r.gsm} sig={r.sig.includes("gsm")} />
              <Cell v={r.sign} sig={false} strong={r.sign === "0.000"} />
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <p className="mt-[11px] font-mono text-[11.5px] leading-[1.85] text-note">
        ★ = significantly different from baseline (diff &gt; 2×SE). SC-TIES gains 0.716 against a
        0.713 baseline, which is <b className="font-medium text-ink">not</b> significant. The
        significant result is +0.017 over SM-TIES, cross-method. Every merge variant loses GSM8K
        against baseline, both proposed methods included. Distillation overwrites maths capability
        before any merge happens (individual maths LoRA: 0.466 against 0.642).
      </p>
    </div>
  );
}