import type { Metadata } from "next";
import ProjectShell, { H2, P, Note, Facts } from "@/components/ProjectShell";
import AccuracyBars from "@/components/art/AccuracyBars";

export const metadata: Metadata = {
  title: "Text-to-SQL: SFT then GRPO — Rishav Raj",
  description:
    "Post-training Qwen2.5-Coder-7B for text-to-SQL with SFT then GRPO, rewarded by executing the generated SQL. The SFT model, quantized to a 4.4 GB GGUF, is deployed on a CPU EC2 instance at 66.0% execution accuracy.",
};

const RESULTS: [string, string, string, string, string][] = [
  ["Base", "50.6", "38.1", "67.1", "~15 GB"],
  ["SFT", "66.6", "53.1", "84.3", "~15 GB"],
  ["SFT + GRPO", "68.4", "55.1", "85.9", "~15 GB"],
  ["SFT GGUF Q4_K_M", "66.0", "52.8", "83.5", "4.4 GB"],
];

function Results() {
  const cols = ["Model", "Overall EX (%)", "BIRD EX (%)", "Spider EX (%)", "Size"];
  return (
    <div className="mt-[22px] overflow-x-auto">
      <table className="w-full min-w-[460px] border-collapse font-mono text-[12px]">
        <caption className="mb-[10px] text-left font-mono text-[11px] tracking-[0.12em] text-note uppercase">
          Execution accuracy · 1,600 held-out questions · 21 unseen databases
        </caption>
        <thead>
          <tr>
            {cols.map((h, i) => (
              <th
                key={h}
                scope="col"
                className={`border-b border-rule pb-[9px] font-medium text-[11px] tracking-[0.12em] text-note uppercase ${
                  i === 0 ? "pr-3 text-left" : "px-3 text-right"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RESULTS.map(([model, overall, bird, spider, size]) => {
            const deployed = model.includes("GGUF");
            const best = model === "SFT + GRPO";
            return (
              <tr key={model}>
                <td
                  className={`border-b border-hair py-[9px] pr-3 text-left ${
                    best || deployed ? "font-medium text-ink" : "text-body"
                  }`}
                >
                  {model}
                  {deployed && (
                    <span className="ml-2 text-[10.5px] tracking-[0.1em] text-accent uppercase">
                      deployed
                    </span>
                  )}
                  {best && (
                    <span className="ml-2 text-[10.5px] tracking-[0.1em] text-note uppercase">
                      best
                    </span>
                  )}
                </td>
                <td
                  className={`border-b border-hair px-3 py-[9px] text-right tabular-nums ${
                    best ? "font-medium text-accent" : deployed ? "font-medium text-ink" : "text-body"
                  }`}
                >
                  {overall}
                </td>
                <td className="border-b border-hair px-3 py-[9px] text-right tabular-nums text-body">
                  {bird}
                </td>
                <td className="border-b border-hair px-3 py-[9px] text-right tabular-nums text-body">
                  {spider}
                </td>
                <td
                  className={`border-b border-hair px-3 py-[9px] text-right tabular-nums ${
                    deployed ? "font-medium text-accent" : "text-body"
                  }`}
                >
                  {size}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function TextToSQL() {
  return (
    <ProjectShell
      eyebrow="Text-to-SQL · Mar–Jun 2026"
      title="Two rounds of post-training, rewarded by actually running the SQL."
      lede="Execution accuracy went 50.6 to 66.6 to 68.4 on 1,600 held-out questions from 21 databases that never appear in training. The best score came from GRPO; the model I actually deployed is the quantized SFT one. Both facts belong on the page."
      repo="https://github.com/dLounce/Text-to-SQL"
    >
      <Results />
      <Note>
        Overall is the blend across both benchmarks; BIRD and Spider are the same models scored on
        each source separately. The best experimental score is SFT + GRPO at 68.4%. The model I
        deployed is the SFT adapter merged into Qwen2.5-Coder-7B and quantized to GGUF Q4_K_M: 66.0%,
        which is 0.6 points below SFT — about 99% of its accuracy — while cutting the artifact from
        about 15 GB to 4.4 GB. The endpoint serves that quantized SFT model, not the GRPO one.
      </Note>

      <AccuracyBars />

      <H2>The 30-point gap is the result</H2>
      <P>
        Spider finishes at 85.9 and BIRD at 55.1. Reporting 68.4 alone would let a reader assume
        uniform competence at that level, which is not what happened. BIRD has larger, messier
        schemas and questions that need external knowledge; Spider is cleaner and smaller. The
        post-training helped both, BIRD by 17.0 points and Spider by 18.8, without closing the
        difficulty gap between them. In this experiment, more RL raised both scores without bringing
        the two benchmarks together.
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
          ["Serving", "GGUF Q4_K_M · llama.cpp · t3.xlarge EC2 (CPU)"],
          ["Tracking", "MLflow experiments · CloudWatch metrics"],
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
        returned nothing. When the reference answer is an empty table, execution match becomes a weak
        signal — unrelated SQL can also return no rows, so a query that answers a different question
        would still score as correct.
      </P>
      <Note>
        On sources: the databases used for the BIRD portion come from BIRD&apos;s train split, and
        the evaluation questions and schemas were held out inside this project&apos;s own split.
        These are not the official BIRD dev-set numbers and should not be read as comparable to a
        leaderboard.
      </Note>

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

      <H2>Serving the model on a CPU instance</H2>
      <P>
        I merged the SFT adapter into Qwen2.5-Coder-7B, quantized it to GGUF Q4_K_M, and served it
        with llama.cpp on a t3.xlarge EC2 instance — CPU only, no GPU. A FastAPI proxy sits in front:
        it validates the input, enforces a hard request timeout, writes structured JSON logs, and
        exposes a health check. The 4.4 GB model scored 66.0% execution accuracy, 0.6 points below
        the full SFT model, while the artifact shrank from about 15 GB to 4.4 GB.
      </P>
      <P>
        Training runs and evaluations are tracked in MLflow, so the four models above can be compared
        on the same axes. The FastAPI proxy emits request metrics to CloudWatch, which backs a small
        dashboard for latency and error rate. The instance can be stopped between uses.
      </P>

      <H2>A demo you can run</H2>
      <P>
        There is a small hosted sandbox over several of the held-out databases. Pick a case, look at
        the SQL the model generated, edit it or write your own, and run it: the query executes
        against the real SQLite database and the result set is checked against a held-out gold query,
        so correctness is decided by execution rather than string matching. The gold SQL is never
        sent to the browser.
      </P>
      <P>
        Execution runs server-side in a query-only AWS Lambda with an 8-second cap. This SQL sandbox
        is a separate service from the EC2 endpoint that generates the SQL &mdash; one runs queries,
        the other runs the model.
      </P>
      <a
        href="/sql-demo.html"
        target="_blank"
        rel="noreferrer"
        className="mt-[6px] inline-block border-b border-accent pb-1 font-mono text-[12px] text-accent no-underline"
      >
        Open the SQL sandbox ↗
      </a>

      <H2>Latency depended more on the prompt than the format</H2>
      <P>
        Two latency numbers get quoted for this model, and they measure different things. Under
        benchmark-style prompting, where the model writes out its full reasoning before the query, a
        single question took about 422 seconds on the CPU instance. With the production prompt, which
        asks only for the SQL, one measured request returned in about 12 seconds on the same
        hardware.
      </P>
      <P>
        That 12 seconds is one measured production request, not an average — I have not run enough
        production traffic to report a median. The point it makes is still the useful one: in this
        setup, the prompt design changed latency far more than the model format did. Quantizing to
        GGUF made the model smaller; asking it to stop reasoning out loud is what made it fast.
      </P>

      <H2>What broke, and what it means for the GRPO number</H2>
      <P>
        The GRPO run loads the merged SFT model and then applies the saved SFT adapter on top as the
        trainable adapter, so at initialisation the SFT update is present twice. The 68.4% comes from
        that run. It is documented in the repository rather than quietly re-run with a clean
        initialisation and reported as if nothing had happened.
      </P>
      <P>
        Because of it, I read 68.4% as the observed score from this specific run, not a clean measure
        of what GRPO alone added. Some of the 1.8-point lift over SFT is confounded by the doubled
        initialisation, so I do not claim GRPO caused the whole gain. Settling that needs a re-run
        from a single initialisation — the honest next step, and one I have not done yet.
      </P>
    </ProjectShell>
  );
}
