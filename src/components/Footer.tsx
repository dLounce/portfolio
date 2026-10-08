import Link from "next/link";

const SECTIONS = [
  { label: "Projects", href: "/#projects" },
  { label: "Thesis", href: "/#thesis" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

const ELSEWHERE = [
  { label: "Email", href: "mailto:rrishavrraj@gmail.com", ext: false },
  { label: "LinkedIn", href: "https://linkedin.com/in/ris7av", ext: true },
  { label: "GitHub", href: "https://github.com/dLounce", ext: true },
  { label: "Résumé (PDF)", href: "/resume/CV_Rishav.pdf", ext: true },
];

const linkClass =
  "text-[15px] text-ink no-underline underline-offset-[5px] decoration-rule hover:text-accent hover:underline";

const labelClass = "mb-[14px] font-mono text-[11.5px] tracking-[0.16em] text-note uppercase";

export default function Footer() {
  return (
    <footer className="ml-side border-t border-rule bg-card px-[46px] pt-[52px] pb-[26px] max-[900px]:ml-0 max-[900px]:px-[22px]">
      <div className="mx-auto max-w-col max-[900px]:max-w-none">
        <div className="grid grid-cols-[1.7fr_1fr_1fr] gap-x-[40px] gap-y-[34px] max-[700px]:grid-cols-2">
          <div className="max-[700px]:col-span-2">
            <p className="text-[21px] leading-[1.2] font-bold tracking-[-0.01em] text-ink">
              Rishav Raj
            </p>
            <p className="mt-[8px] max-w-[34ch] text-[15px] leading-[1.55] text-mute">
              AI / ML engineer. LLM fine-tuning, deployment, evaluation and agent security.
            </p>
            <p className="mt-[12px] font-mono text-[12px] tracking-[0.04em] text-note">
              Delhi, India
            </p>
          </div>

          <nav aria-label="Sections">
            <p className={labelClass}>On this site</p>
            <ul className="space-y-[9px]">
              {SECTIONS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Contact and profiles">
            <p className={labelClass}>Elsewhere</p>
            <ul className="space-y-[9px]">
              {ELSEWHERE.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(l.ext ? { target: "_blank", rel: "noreferrer" } : {})}
                    className={linkClass}
                  >
                    {l.label}
                    {l.ext && (
                      <span aria-hidden="true" className="ml-[5px] font-mono text-[12px] text-note">
                        ↗
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-[44px] flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 border-t border-hair pt-[18px] font-mono text-[12px] text-note">
          <span>© 2026 Rishav Raj</span>
          <a href="#main" className="text-note no-underline hover:text-accent hover:underline">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
