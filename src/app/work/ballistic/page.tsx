import type { Metadata } from "next";
import ProjectShell, { H2, P, Facts } from "@/components/ProjectShell";
import AgreementBars from "@/components/art/AgreementBars";

export const metadata: Metadata = {
  title: "LLM quiz grader, Ballistic Learning Systems — Rishav Raj",
  description:
    "AI internship: an LLM that grades short answers, measured against a 118-item human-labelled benchmark. 71% agreement, 26.9 points above baseline.",
};

export default function Ballistic() {
  return (
    <ProjectShell
      eyebrow="Ballistic Learning Systems · AI Intern · Jun–Jul 2025"
      title="The test was not whether the grader was right, but whether it agreed with the humans who marked first."
      lede="A quiz chatbot that marks free-text answers, scored against 118 items human graders had labelled first. Prompt and retrieval changes raised agreement with those graders from 44% to 71%."
      repo={null}
    >
      <Facts
        rows={[
          ["Stack", "OpenAI API · LangChain · Pinecone · MySQL"],
          ["Benchmark", "118 human-labelled items"],
          ["Agreement with graders", "71.0%"],
          ["Baseline agreement", "44.1%"],
          ["Improvement", "+26.9 points"],
          ["Retrieval", "RAG over PDFs, embedded into Pinecone"],
        ]}
      />

      <H2>Agreement, not accuracy</H2>
      <P>
        There is a reference set &mdash; 118 answers that human graders marked first &mdash; but
        agreeing with those graders is not the same as being universally right. Short answers are
        judgement calls, and the graders themselves would not agree with each other on every item.
        So I report agreement with the human labels, which keeps the 29% disagreement in plain sight,
        rather than calling the number accuracy.
      </P>

      <AgreementBars />

      <H2>What I&apos;d measure differently</H2>
      <P>
        118 items is a small benchmark, and it leans on one set of human labels. It has no
        inter-rater agreement to say how much the graders agreed with each other, no held-out set
        kept aside while I tuned the prompts, and no confidence interval on the 71%. A stronger
        version would use several graders per answer, report their agreement as a ceiling, develop
        the prompt on one split and measure on another, and put an interval around the result.
      </P>
      <P>
        The jump from 44% to 71% came from prompt and retrieval changes made together. I did not
        measure the two independently, so I cannot say how much of the gain was the prompt and how
        much was the retrieval. That separation is the first thing I would run again.
      </P>
    </ProjectShell>
  );
}
