const WORK = [
  {
    title: "Text-to-SQL — SFT then GRPO",
    desc: "Ask a question of a database the model has never seen. Generation server-side, SQL executed in your browser. Evaluated on 1,600 held-out questions across 21 unseen databases, split at database level so nothing leaks.",
    tags: ["Live demo", "TRL · vLLM · LoRA"],
    metric: "50.6 → 68.4",
    href: "https://github.com/dLounce/Text-to-SQL",
  },
  {
    title: "Multimodal deepfake detection (DGM4)",
    desc: "Two-way cross-attention between image patches and caption tokens over 208K image–caption pairs. 4.3M of 432M parameters trained — one percent.",
    tags: ["CLIP ViT-L · LoRA", "LLaVA-7B"],
    metric: "0.862 → 0.965 AUC",
    href: "https://github.com/dLounce/dgm4-multimodal-detection",
  },
  {
    title: "LLM quiz grader — Ballistic Learning Systems",
    desc: "Graded short answers against a 118-item human-labelled benchmark during a two-month internship. RAG over PDFs into Pinecone.",
    tags: ["Internship · 2025", "LangChain · Pinecone"],
    metric: "71% grader agreement",
    href: null,
  },
];

export default function WorkRows() {
  return (
    <div>
      {WORK.map((w) => {
        const Tag = (w.href ? "a" : "div") as "a" | "div";
        return (
          <Tag
            key={w.title}
            {...(w.href ? { href: w.href, target: "_blank", rel: "noreferrer" } : {})}
            className={[
              "group relative grid grid-cols-[1fr_auto] items-baseline gap-6 py-[21px]",
              "border-b border-hair text-inherit no-underline first:border-t first:border-t-rule",
              "after:absolute after:bottom-[-1px] after:left-0 after:h-px after:w-0 after:bg-accent",
              "after:transition-[width] after:duration-[340ms] after:ease-ledger hover:after:w-full",
              "max-[900px]:grid-cols-1",
            ].join(" ")}
          >
            <div>
              <div className="text-[19px] font-bold tracking-[-0.01em] transition-colors group-hover:text-accent">
                {w.title}
              </div>
              <div className="mt-[5px] max-w-[58ch] text-[14.5px] text-mute">{w.desc}</div>
              <div className="mt-[11px]">
                {w.tags.map((t) => (
                  <span key={t} className="mr-[6px] border border-rule px-[7px] py-[2px] font-mono text-[9.5px] tracking-[0.1em] text-note uppercase">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="font-mono text-[11.5px] whitespace-nowrap text-accent transition-transform duration-300 ease-ledger group-hover:-translate-x-[5px]">
              {w.metric}
            </div>
          </Tag>
        );
      })}
    </div>
  );
}