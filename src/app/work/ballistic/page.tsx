import type { Metadata } from "next";
import ProjectShell, { H2, P, Note, Facts } from "@/components/ProjectShell";

export const metadata: Metadata = {
  title: "LLM quiz grader, Ballistic Learning Systems — Rishav Raj",
  description:
    "AI internship: an LLM that grades short answers, measured against a 118-item human-labelled benchmark. 71% agreement, 26.9 points above baseline.",
};

export default function Ballistic() {
  return (
    <ProjectShell
      eyebrow="Ballistic Learning Systems · AI Intern · Jun–Jul 2025"
      title="There is no correct mark for a short answer, only the one a human would have given."
      lede="A quiz chatbot that marks free-text answers. It was scored against 118 items that human graders had labelled first, because a rubric score on its own is easy to claim and hard to defend."
      repo={null}
    >
      <Facts
        rows={[
          ["Stack", "OpenAI API · LangChain · Pinecone · MySQL"],
          ["Benchmark", "118 human-labelled items"],
          ["Agreement with graders", "71%"],
          ["Improvement over baseline", "+26.9 points"],
          ["Retrieval", "RAG over PDFs, embedded into Pinecone"],
        ]}
      />

      <H2>Agreement, not accuracy</H2>
      <P>
        A short-answer mark has no ground truth behind it. Calling the number accuracy would imply a
        correctness the task does not have. Agreement against a labelled set sounds weaker and
        leaves the 29% disagreement in plain sight.
      </P>

      <H2>What broke</H2>
      <Note>
        TODO(rishav) — required by §6. This was your first industry role, so the useful version is
        not a technical postmortem. It is what you got wrong about working on someone else&apos;s
        production system and what you do differently now. 118 items is also a small benchmark. If
        you would build it larger or differently today, say so.
      </Note>
    </ProjectShell>
  );
}
