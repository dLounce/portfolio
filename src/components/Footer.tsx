const LINKS = [
  { label: "Email", href: "mailto:rrishavrraj@gmail.com", ext: false },
  { label: "LinkedIn", href: "https://linkedin.com/in/ris7av", ext: true },
  { label: "GitHub", href: "https://github.com/dLounce", ext: true },
  { label: "Résumé", href: "/resume/Rishav_Resume.pdf", ext: true },
];

export default function Footer() {
  return (
    <footer className="ml-side border-t border-rule bg-card px-[46px] py-8 max-[900px]:ml-0 max-[900px]:px-[22px]">
      <div className="mx-auto flex max-w-col flex-wrap items-center justify-between gap-4 max-[900px]:max-w-none">
        <span className="font-mono text-[12px] text-note">© 2026 Rishav Raj · Patna, India</span>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px]">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.ext ? { target: "_blank", rel: "noreferrer" } : {})}
              className="text-accent no-underline hover:underline"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
