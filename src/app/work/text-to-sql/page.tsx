import type { Metadata } from "next";
import ProjectShell, { H2, P, Note, Facts } from "@/components/ProjectShell";

export const metadata: Metadata = {
  title: "Text-to-SQL: SFT then GRPO — Rishav Raj",
  description:
    "Post-training Qwen2.5-Coder-7B for text-to-SQL with SFT then GRPO, rewarded by executing the generated SQL. Overall execution accuracy 50.6 → 66.6 → 68.4 on 21 unseen databases.",
};

const RESULTS: [string, string, string, string][] = [
  ["Base", "50.6", "38.1", "67.1"],
  ["SFT", "66.6", "53.1", "84.3"],
  ["SFT + GRPO", "68.4", "55.1", "85.9"],
];

function Results() {
  return (
    <table className="mt-[22px] w-full border-collapse font-mono text-[12px]">
      <thead>
        <tr>
          {["Model", "Overall", "BIRD", "Spider"].map((h) => (
            <th
              key={h}
              className="border-b border-rule pr-3 pb-[9px] text-left font-medium text-[9.5px] tracking-[0.12em] text-note uppercase"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {RESULTS.map(([model, overall, bird, spider], i) => (
          <tr key={model}>
            <td className={`border-b border-hair py-[9px] pr-3 ${i === 2 ? "font-medium text-ink" : "text-body"}`}>
              {model}
            </td>
            <td className={`border-b border-hair py-[9px] pr-3 ${i === 2 ? "font-medium text-accent" : "text-body"}`}>
              {overall}
            </td>
            <td className="border-b border-hair py-[9px] pr-3 text-body">{bird}</td>
            <td className="border-b border-hair py-[9px] pr-3 text-body">{spider}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function TextToSQL() {
  return (
    <ProjectShell
      eyebrow="Text-to-SQL · Mar–Jun 2026"
      title="Two rounds of post-training, rewarded by actually running the SQL."
      lede="Execution accuracy went 50.6 to 66.6 to 68.4 on 1,600 held-out questions from 21 databases that never appear in training. That overall figure blends two benchmarks that behave nothing alike, so it is worth splitting."
      repo="https://github.com/dLounce/Text-to-SQL"
    >
      <Results />
      <Note>
        Execution accuracy. Overall is the blend across both benchmarks; BIRD and Spider are the
        same models scored on each source separately.
      </Note>

      <H2>The 30-point gap is the result</H2>
      <P>
        Spider finishes at 85.9 and BIRD at 55.1. Reporting 68.4 alone would let a reader assume
        uniform competence at that level, which is not what happened. BIRD has larger, messier
        schemas and questions that need external knowledge; Spider is cleaner and smaller. The
        post-training helped both, BIRD by 17.0 points and Spider by 18.8, without closing the
        difficulty gap between them. No amount of RL was going to.
      </P>

      <Facts
        rows={[
          ["Base model", "Qwen2.5-Coder-7B"],
          ["Method", "LoRA r=16 · TRL · vLLM · GRPO"],
          ["Data", "OmniSQL-formatted BIRD + Spider"],
          ["Test set", "1,600 examples · 21 unseen databases"],
          ["Split", "Database level, stratified by source, 85/5/10"],
          ["SFT", "2 epochs · lr 1e-4 · loss on completion only"],
          ["GRPO", "1 epoch · 8 samples/prompt at temperature 1.0"],
        ]}
      />

      <H2>Why the split is at database level</H2>
      <P>
        If you split by question, the same database appears in training and test, the model
        memorises its schema, and the score measures recall rather than generalisation. Splitting at
        database level means all 21 test databases are genuinely unseen. It is also why these numbers
        are not comparable to higher ones reported under question-level splits.
      </P>
      <P>
        The training corpus was filtered by execution, not inspection: gold queries were run against
        their databases and rows dropped when the query errored, took longer than 15 seconds, or
        returned nothing. A question whose reference answer is an empty table teaches the model
        nothing useful.
      </P>

      <H2>The reward is the query result</H2>
      <P>
        There is no reward model. A completion scores 1.0 when its result set matches the gold
        result, 0.1 when the SQL runs but returns the wrong rows or times out, and 0 when it fails
        to execute at all. Row order is ignored unless the gold query has an ORDER BY. The 0.1 band
        matters: it separates &quot;wrote valid SQL that answered the wrong question&quot; from
        &quot;wrote something that isn&apos;t SQL&quot;, and those deserve different gradients.
      </P>
      <P>
        GRPO trained only on prompts where the SFT model was neither always right nor always wrong
        across 8 samples. Prompts it already handled reliably carry no signal, and prompts it never
        got were mostly beyond the model. Training ran for one epoch with 150 dev examples scored
        every 50 steps, stopping after two checks without improvement.
      </P>
      <P>
        Query execution uses a SQLite progress handler as a wall-clock guard rather than a
        signal-based timeout, because signals cannot interrupt a statement already executing inside
        SQLite. Without it a single runaway query stalls the whole rollout.
      </P>

      <H2>What broke</H2>
      <P>
        The GRPO run loads the merged SFT model and then applies the saved SFT adapter on top as the
        trainable adapter, so at initialisation the SFT update is present twice. The numbers above
        come from that run. I have documented it in the repository rather than quietly re-running
        with a clean initialisation and reporting the result as if nothing had happened.
      </P>
      <Note>
        TODO(rishav) — finish this in your own words. A reader will want two things: whether you
        noticed the double-applied adapter before or after the run, and what a clean re-run would
        cost to settle it. Knowing it is there and saying what you think it is worth is a strong
        answer.
      </Note>
    </ProjectShell>
  );
}
