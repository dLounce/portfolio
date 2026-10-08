import Tenure from "./Tenure";

type Entry = {
  role: string;
  org: string;
  place?: string;
  when: string;
  note?: string;
  tags?: string[];
  link?: { label: string; href: string };
  // set while the role is still going; drives the "Ongoing · n months" line
  ongoing?: { year: number; month: number };
};

const GROUPS: { label: string; entries: Entry[] }[] = [
  {
    label: "Experience",
    entries: [
      {
        role: "Backend AI Engineer Intern",
        org: "FlyRank AI",
        when: "Aug 2026–present",
        ongoing: { year: 2026, month: 8 },
      },
      {
        role: "Artificial Intelligence Intern",
        org: "Ballistic Learning Systems",
        place: "Faridabad",
        when: "Jun–Jul 2025",
        note: "Built an LLM short-answer grader and raised agreement with human graders from 44% to 71% on a 118-item benchmark.",
        tags: ["LangChain", "Pinecone", "RAG"],
        link: { label: "Read the write-up", href: "/work/ballistic" },
      },
    ],
  },
  {
    label: "Education",
    entries: [
      {
        role: "M.Sc. Computer Science",
        org: "Central University of Rajasthan",
        place: "Ajmer",
        when: "Jul 2024–Jun 2026",
        note: "CGPA 7.1/10. Thesis on task-vector merging under distillation, supervised by Dr. Gaurav Meena.",
        link: { label: "Read the thesis write-up", href: "/work/kd-ties" },
      },
      {
        role: "Bachelor of Computer Applications",
        org: "Patliputra University",
        place: "Patna",
        when: "Aug 2018–Jul 2021",
        note: "Final result 73%.",
      },
    ],
  },
];

export default function ExperienceTimeline() {
  return (
    <div className="max-w-text">
      {GROUPS.map((g, gi) => (
        <div key={g.label} className={gi > 0 ? "mt-[46px]" : ""}>
          <h3 className="mb-[20px] flex items-center gap-[14px] font-mono text-[12px] tracking-[0.16em] text-note uppercase">
            {g.label}
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </h3>

          <ol>
            {g.entries.map((e, i) => {
              const first = i === 0;
              const last = i === g.entries.length - 1;
              const gap = last ? "" : "pb-[26px]";
              const line =
                first && last ? null : first ? "top-[12px] bottom-0" : last ? "top-0 h-[12px]" : "inset-y-0";

              return (
                <li
                  key={e.org + e.role}
                  className="grid grid-cols-[164px_18px_1fr] gap-x-[16px] max-[700px]:grid-cols-[18px_1fr] max-[700px]:gap-x-[14px]"
                >
                  <div
                    className={`font-mono text-[12.5px] leading-[20px] tracking-[0.02em] text-body min-[701px]:text-right max-[700px]:col-start-2 max-[700px]:row-start-1 max-[700px]:pb-[8px] ${gap} max-[700px]:pb-[8px]`}
                  >
                    <div>{e.when}</div>
                    {e.ongoing && (
                      <div className="mt-[2px] text-[12px] text-accent">
                        <Tenure sinceYear={e.ongoing.year} sinceMonth={e.ongoing.month} />
                      </div>
                    )}
                  </div>

                  <div className="relative max-[700px]:col-start-1 max-[700px]:row-span-2 max-[700px]:row-start-1">
                    {line && (
                      <span
                        aria-hidden="true"
                        className={`absolute left-1/2 w-px -translate-x-1/2 bg-rule ${line}`}
                      />
                    )}
                    <span
                      aria-hidden="true"
                      className={`absolute top-[7px] left-1/2 h-[10px] w-[10px] -translate-x-1/2 rounded-full border ${
                        e.ongoing ? "border-accent bg-accent" : "border-note bg-paper"
                      }`}
                    >
                      {e.ongoing && (
                        <span className="absolute -inset-[5px] animate-blip rounded-full border border-accent" />
                      )}
                    </span>
                  </div>

                  <div className={`${gap} max-[700px]:col-start-2 max-[700px]:row-start-2`}>
                    <div
                      className={`rounded-[6px] border bg-card px-[20px] py-[17px] ${
                        e.ongoing ? "border-accent" : "border-rule"
                      }`}
                    >
                      <h4 className="text-[20px] leading-[1.25] font-bold tracking-[-0.01em] text-ink">
                        {e.role}
                      </h4>
                      <p className="mt-[3px] text-[16.5px] leading-[1.4] text-body">
                        {e.org}
                        {e.place && <span className="text-note"> · {e.place}</span>}
                      </p>
                      {e.note && (
                        <p className="mt-[10px] text-[15px] leading-[1.6] text-mute">{e.note}</p>
                      )}
                      {e.tags && (
                        <ul className="mt-[13px] flex flex-wrap gap-[6px]">
                          {e.tags.map((t) => (
                            <li
                              key={t}
                              className="border border-rule px-[6px] py-[2px] font-mono text-[11px] tracking-[0.1em] whitespace-nowrap text-note uppercase"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      )}
                      {e.link && (
                        <a
                          href={e.link.href}
                          className="mt-[13px] inline-block font-mono text-[12px] text-accent no-underline hover:underline"
                        >
                          {e.link.label} →
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
