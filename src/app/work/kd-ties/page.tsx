import type { Metadata } from "next";
import ProjectShell, { H2, P, Facts } from "@/components/ProjectShell";
import ThesisGeometry from "@/components/art/ThesisGeometry";
import ThesisTable from "@/components/ThesisTable";

export const metadata: Metadata = {
  title: "KD-TIES: TIES merging of distilled LoRA adapters — Rishav Raj",
  description:
    "M.Sc. thesis. Merging two distilled LoRA adapters with TIES gave a sign conflict of 0.000, so TIES behaved like plain averaging in this setup. Two fixes tested; the only significant gain between methods is +0.017 MMLU.",
};

const LINK = "text-accent no-underline hover:underline";

export default function KdTies() {
  return (
    <ProjectShell
      eyebrow="KD-TIES · M.Sc. thesis · Dec 2025–Jun 2026"
      title="In my setup, TIES merging turned into plain averaging because both adapters carried the same instruction-tuning shift."
      lede="I distilled Qwen2.5-32B into LoRA adapters for a 7B model, one for instruction following and one for maths, and merged them with TIES. Sign conflict measured 0.000, so there was nothing for TIES to resolve. Subtracting the shared shift first brought it back to 0.237."
      repo="https://github.com/dLounce/KD-ties"
    >
      <Facts
        rows={[
          ["Teacher and student", "Qwen2.5-32B-Instruct to Qwen2.5-7B"],
          ["Data", "5,000 samples per domain: a GPT-4 instruction set and MetaMathQA (GSM_AnsAug)"],
          ["Adapters", "4 LoRAs · r=16, alpha=16 · 1 epoch · learning rate 2e-4"],
          ["Evaluation", "MMLU 5,000 · HellaSwag 2,000 · GSM8K 500 questions, seed 42"],
          ["Stack", "vLLM · Unsloth · PEFT · PyTorch"],
          ["Supervisor", "Dr. Gaurav Meena, Central University of Rajasthan"],
        ]}
      />

      <H2>What TIES does</H2>
      <P>
        TIES is a way to merge fine-tuned adapters into one model. For each adapter it keeps the
        largest 70% of the changes, picks one sign per weight by adding the changes together, and
        averages only the changes that agree with that sign. Sign conflict is how often a change
        points against the sign that gets picked. At zero, the election never overrules anything.
      </P>

      <H2>What I expected, and what happened</H2>
      <P>
        I trained adapters two ways. Same-manifold adapters (SM) are trained on Qwen2.5-7B-Instruct.
        Cross-manifold adapters (CM) are trained on the 7B base model, and their task vectors are
        measured against that base. Everything is scored on Qwen2.5-7B-Instruct.
      </P>
      <P>
        I expected sign election to settle the disagreements between an instruction adapter and a
        maths adapter. It settled nothing. Sign conflict measured 0.000.
      </P>
      <P>
        A cross-manifold task vector{" "}
        <span className="font-mono text-[14px]">τ = θ_LoRA_on_target − θ_base</span> carries the
        whole instruct-tuning shift inside it. That anchor dwarfs the LoRA signal, so both vectors
        point almost the same way and TIES has nothing left to arbitrate.
      </P>

      <ThesisGeometry />

      <H2>Two fixes</H2>
      <P>
        SC-TIES subtracts the anchor, merges what is left, then puts the anchor back. Sign conflict
        goes from 0.000 to 0.237.
      </P>
      <pre className="mb-[15px] max-w-text overflow-x-auto rounded-[6px] border border-rule bg-card px-[18px] py-[14px] font-mono text-[13px] leading-[1.7] text-body">
        {`τ_corrected = τ_cross − τ_anchor
τ_merged    = TIES(τ_corrected)
θ_final     = θ_base + τ_anchor + τ_merged`}
      </pre>
      <P>
        OP-TIES projects the shared top-16 subspace out of each weight update before merging.
        Subspace interference ρ₁₆ goes from 0.026 to 0.000, and OP-TIES keeps commonsense best, with
        HellaSwag at 0.792.
      </P>

      <H2>Results</H2>
      <ThesisTable />

      <H2>Limits</H2>
      <P>
        This is one model family: a Qwen2.5-32B teacher and a 7B student, two domains, 5,000 samples
        each and one epoch of training. I didn&apos;t test other model families, sizes or training
        lengths.
      </P>

      <H2>What I&apos;d do differently</H2>
      <P>
        I measured sign conflict only after the merge failed to help. Instrumented from the first
        run, the diagnosis would have taken days instead of weeks. I was watching the benchmark
        score when the zero was the louder signal.
      </P>

      <H2>Code and data</H2>
      <P>
        Notebooks and figures are in the{" "}
        <a href="https://github.com/dLounce/KD-ties" target="_blank" rel="noreferrer" className={LINK}>
          KD-ties repo
        </a>
        , and the four trained adapters are on{" "}
        <a
          href="https://www.kaggle.com/datasets/rrishavrraj/all-new-lora"
          target="_blank"
          rel="noreferrer"
          className={LINK}
        >
          Kaggle
        </a>
        . The thesis PDF is available on request.
      </P>
    </ProjectShell>
  );
}
