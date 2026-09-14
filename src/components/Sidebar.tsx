import LogTail from "./LogTail";
import SideNav from "./SideNav";

// hoisted to module scope: a new array literal each render would retrigger
// LogTail's effect on every re-render and reseed the log.
//
// TODO(rishav): these name real mechanisms from sentinel-procurement (the
// guards, the extraction flags, the control/treatment/A-A' method) but they
// are not lines captured from an actual run. Swap in real ones from
// eval/results/ before launch. The previous version of this tail streamed
// BPI 2017 loan activity names under a payment narrative, which is the
// mistake worth not repeating.
const TAIL_LINES = [
  "control · vendor messages recorded",
  "treatment · payload injected r3",
  "interpreter · extraction_flag=tiered",
  "schema_validate · VendorOffer ok",
  "buyer · decision=counter",
  "price_policy · below floor · REJECT",
  "budget_guard · pass",
  "A/A′ · within noise band",
  "place_order · gated · no order",
  "attack-not-reached · unscored",
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
    href: "#", // TODO(rishav): point at the real CV PDF
    external: false,
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
          <div className="mt-0.5 font-mono text-[10px] tracking-[0.09em] text-note uppercase">
            AI · Agent Engineer
          </div>
        </div>
      </div>

      <SideNav />

      <div className="mt-6 mb-2 ml-[11px] font-mono text-[9.5px] tracking-[0.15em] text-faint uppercase max-[900px]:hidden">
        Connect
      </div>
      <div className="max-[900px]:hidden">
        {SOCIAL.map((s) => (
          <a
            key={s.label}
            href={s.href}
            {...(s.external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="flex items-center gap-[10px] px-[11px] py-[5px] font-mono text-[11px] text-note no-underline hover:text-accent"
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
        <LogTail lines={TAIL_LINES} />
      </div>
    </aside>
  );
}
