import SideNav from "./SideNav";

// static, verified results. no animation, no live dot, no generated
// timestamps: the previous tail stamped the visitor's own clock onto lines
// that were never captured from a real run, which read as a live feed it
// was not.
const PROOF: [string, string][] = [
  ["0 / 100", "unauthorised orders · sentinel live attacks"],
  ["66.0%", "deployed text-to-SQL execution accuracy"],
  ["4.4 GB", "served model, from ~15 GB"],
  ["~12 s", "single request · EC2 CPU"],
];

const SOCIAL = [
  {
    label: "GitHub",
    href: "https://github.com/dLounce",
    external: true,
    paths: [
      "M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.3 4.3 0 00-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 00-6 0C6.8 2.8 5.8 3.1 5.8 3.1a4.3 4.3 0 00-.1 3.2A4.6 4.6 0 004.4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21",
    ],
    circles: [],
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/ris7av",
    external: true,
    paths: ["M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z", "M6 9H2v12h4z"],
    circles: [{ cx: 4, cy: 4, r: 2 }],
  },
  {
    label: "Curriculum vitae",
    href: "/resume/Rishav_Resume.pdf",
    external: true,
    paths: ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
    circles: [],
  },
];

export default function Sidebar() {
  return (
    <aside
      className={[
        "fixed top-0 left-0 z-10 flex h-screen w-side flex-col",
        "border-r border-rule bg-card px-5 pt-[26px] pb-5",
        "max-[900px]:static max-[900px]:h-auto max-[900px]:w-auto",
        "max-[900px]:border-r-0 max-[900px]:border-b max-[900px]:px-[22px] max-[900px]:py-[18px]",
      ].join(" ")}
    >
      <div className="flex items-center gap-[11px]">
        <div className="grid h-[38px] w-[38px] flex-none place-items-center rounded-full bg-accent font-mono text-[13px] font-medium text-card">
          RR
        </div>
        <div>
          <div className="text-[17px] leading-[1.2] font-bold tracking-[-0.012em]">
            Rishav Raj
          </div>
          <div className="mt-0.5 font-mono text-[11.5px] tracking-[0.09em] text-note uppercase">
            AI · ML Engineer
          </div>
        </div>
      </div>

      {/* desktop hides the Connect block below, so mobile needs its own actions */}
      <div className="mt-3 hidden gap-4 font-mono text-[12px] max-[900px]:flex">
        <a href="/resume/Rishav_Resume.pdf" target="_blank" rel="noreferrer" className="text-accent no-underline">Résumé ↗</a>
        <a href="https://github.com/dLounce" target="_blank" rel="noreferrer" className="text-accent no-underline">GitHub ↗</a>
        <a href="mailto:rrishavrraj@gmail.com" className="text-accent no-underline">Email</a>
      </div>

      <SideNav />

      <div className="mt-6 mb-2 ml-[11px] font-mono text-[11px] tracking-[0.15em] text-faint uppercase max-[900px]:hidden">
        Connect
      </div>
      <div className="max-[900px]:hidden">
        {SOCIAL.map((s) => (
          <a
            key={s.label}
            href={s.href}
            {...(s.external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="flex items-center gap-[10px] px-[11px] py-[5px] font-mono text-[12px] text-note no-underline hover:text-accent"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-3 w-3 fill-none stroke-current"
              strokeWidth={1.6}
            >
              {s.paths.map((d) => (
                <path key={d} d={d} />
              ))}
              {s.circles.map((c) => (
                <circle key={`${c.cx}-${c.cy}`} cx={c.cx} cy={c.cy} r={c.r} />
              ))}
            </svg>
            {s.label}
          </a>
        ))}
      </div>

      <div className="mt-auto max-[900px]:hidden">
        <div className="border-t border-rule pt-3">
          <div className="mb-[9px] font-mono text-[10.5px] tracking-[0.14em] text-faint uppercase">
            verified results
          </div>
          <dl className="flex flex-col gap-[8px]">
            {PROOF.map(([v, k]) => (
              <div key={k} className="grid grid-cols-[auto_1fr] items-baseline gap-x-[10px]">
                <dt className="font-mono text-[14px] text-ink tabular-nums">{v}</dt>
                <dd className="font-mono text-[10.5px] leading-[1.4] tracking-[0.04em] text-note uppercase">
                  {k}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </aside>
  );
}
