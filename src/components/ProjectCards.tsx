import Image, { type StaticImageData } from "next/image";

import BookArt from "./art/BookArt";

// static imports, not /public: next/image then hashes, resizes and serves
// these as webp/avif instead of shipping 8MB of raw png
import deepfake from "@/Assets/Deepfake.png";
import internship from "@/Assets/Internship.png";
import log2agent from "@/Assets/Log2Agent.png";
import procurement from "@/Assets/Procurement.png";
import text2sql from "@/Assets/Text2SQL.png";

// slug -> drawn artwork, used when there is no cover image on disk
const ART: Record<string, () => React.JSX.Element> = {
  ballistic: BookArt,
};

type Project = {
  slug: string;
  title: string;
  hook: string;
  badge: string;
  tags: string[];
  href: string;
  repo: string | null;
  image: StaticImageData | null;
};

const PROJECTS: Project[] = [
  {
    slug: "text-to-sql",
    title: "Text-to-SQL: SFT then GRPO",
    hook: "Fine-tuned Qwen2.5-Coder-7B on execution reward, quantized it to a 4.4 GB GGUF, and served it on a CPU instance. Execution accuracy 50.6 to 68.4 on 21 unseen databases; the deployed model holds 66.0.",
    badge: "Deployed",
    tags: ["TRL/GRPO", "llama.cpp", "AWS EC2"],
    href: "/work/text-to-sql",
    repo: "https://github.com/dLounce/Text-to-SQL",
    image: text2sql,
  },
  {
    slug: "sentinel",
    title: "Sentinel Procurement",
    hook: "A hundred prompt-injection attacks run at a procurement agent. Twelve shifted its decision and none produced an order, because the model is not what authorises orders.",
    badge: "Security eval",
    tags: ["LangGraph", "Prompt injection", "Red team"],
    href: "/work/sentinel",
    repo: "https://github.com/dLounce/sentinel-procurement",
    image: procurement,
  },
  {
    slug: "log2agent",
    title: "Log2Agent",
    hook: "Mined 36,796 process events, generated a LangGraph workflow, and matched historical routing in 50 of 50 replayed cases. The business APIs stay mocked and runtime MCP calls are the next gap.",
    badge: "Recorded run",
    tags: ["PM4Py", "LangGraph", "MCP"],
    href: "/work/log2agent",
    repo: "https://github.com/dLounce/log2agent",
    image: log2agent,
  },
  {
    slug: "dgm4",
    title: "Multimodal deepfake detection",
    hook: "Trains 1% of 432M parameters, then names which caption words were manipulated and localises the altered face region.",
    badge: "Write-up",
    tags: ["CLIP ViT-L", "LoRA", "LLaVA"],
    href: "/work/dgm4",
    repo: "https://github.com/dLounce/dgm4-multimodal-detection",
    image: deepfake,
  },
  {
    slug: "ballistic",
    title: "LLM quiz grader at Ballistic Learning",
    hook: "Raised agreement with human graders from 44% to 71% on a 118-item labelled benchmark, and reported it as agreement rather than accuracy.",
    badge: "Internship · 2025",
    tags: ["LangChain", "Pinecone", "RAG"],
    href: "/work/ballistic",
    repo: null,
    // swap to `null` to use the animated BookArt drawing instead of this still
    image: internship,
  },
];

const GITHUB_PATH =
  "M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.3 4.3 0 00-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 00-6 0C6.8 2.8 5.8 3.1 5.8 3.1a4.3 4.3 0 00-.1 3.2A4.6 4.6 0 004.4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21";

export default function ProjectCards() {
  return (
    // an odd card count would orphan the last one at half width; it spans
    // the full row instead. no effect once the count is even again.
    <div className="grid grid-cols-2 gap-[18px] max-[900px]:grid-cols-1 [&>article:last-child:nth-child(odd)]:col-span-2 max-[900px]:[&>article:last-child:nth-child(odd)]:col-span-1">
      {PROJECTS.map((p) => (
        <article
          key={p.slug}
          className="group relative flex flex-col overflow-hidden rounded-[6px] border border-rule bg-card transition-colors hover:border-note"
        >
          {/* the slug label is always painted and the artwork sits over it, so a
              card with neither an image nor a drawing shows a label rather than a
              grey void. */}
          <div className="relative grid aspect-[16/10] place-items-center overflow-hidden border-b border-rule bg-paper">
            <span className="font-mono text-[11.5px] tracking-[0.14em] text-faint uppercase">
              {p.slug}
            </span>
            {p.image ? (
              <Image
                src={p.image}
                alt=""
                fill
                placeholder="blur"
                sizes="(max-width: 900px) 100vw, 350px"
                className="object-cover"
              />
            ) : (
              ART[p.slug]?.() ?? null
            )}
          </div>

          <div className="flex flex-1 flex-col p-[18px]">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[17px] font-bold tracking-[-0.01em]">
                <a
                  href={p.href}
                  className="text-inherit no-underline transition-colors group-hover:text-accent after:absolute after:inset-0 after:content-['']"
                >
                  {p.title}
                </a>
              </h3>
              <span className="shrink-0 font-mono text-[10.5px] tracking-[0.12em] text-note uppercase">
                {p.badge}
              </span>
            </div>

            <p className="mt-[7px] flex-1 text-[13.5px] leading-[1.6] text-mute">{p.hook}</p>

            <div className="mt-[14px] flex items-end justify-between gap-3">
              <div>
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="mr-[6px] border border-rule px-[6px] py-[2px] font-mono text-[10.5px] tracking-[0.1em] text-note uppercase"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {p.repo && (
                <a
                  href={p.repo}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.title} on GitHub`}
                  className="relative z-10 -m-1 shrink-0 p-1 text-note transition-colors hover:text-accent"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 fill-none stroke-current"
                    strokeWidth={1.6}
                  >
                    <path d={GITHUB_PATH} />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
