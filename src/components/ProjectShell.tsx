import Link from "next/link";

import Sidebar from "@/components/Sidebar";

export function Shot({ src, caption }: { src: string; caption: string }) {
  return (
    <figure className="my-[26px]">
      <div className="relative grid aspect-[16/9] place-items-center overflow-hidden rounded-[6px] border border-rule bg-paper">
        <span className="px-4 font-mono text-[10px] tracking-[0.14em] text-faint uppercase">
          {src.split("/").pop()}
        </span>
        {/* background layer, not <img>: a missing file paints nothing at all,
            so the label underneath shows through with no broken-image marker */}
        <div
          role="img"
          aria-label={caption}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${src})` }}
        />
      </div>
      <figcaption className="mt-[9px] font-mono text-[10px] leading-[1.7] text-note">
        {caption}
      </figcaption>
    </figure>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-[52px] mb-[13px] max-w-text text-[22px] font-light tracking-[-0.012em]">
      {children}
    </h2>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-[15px] max-w-text text-[17px] text-mute">{children}</p>;
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-[15px] max-w-text font-mono text-[10.5px] leading-[1.85] text-note">
      {children}
    </p>
  );
}

export function Facts({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="mt-[22px]">
      {rows.map(([k, v], i) => (
        <div
          key={k}
          className={`grid grid-cols-[186px_1fr] items-baseline gap-4 border-b border-hair py-[10px] max-[900px]:grid-cols-1 ${
            i === 0 ? "border-t border-t-rule" : ""
          }`}
        >
          <dt className="font-mono text-[9.5px] tracking-[0.12em] text-note uppercase">{k}</dt>
          <dd className="font-mono text-[12px] text-body">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function ProjectShell({
  eyebrow,
  title,
  lede,
  repo,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  repo?: string | null;
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main className="ml-side px-[46px] pt-[60px] pb-[100px] max-[900px]:ml-0 max-[900px]:px-[22px] [&>*]:mx-auto [&>*]:max-w-col max-[900px]:[&>*]:max-w-none">
        <div>
          <Link href="/#projects" className="font-mono text-[11px] text-accent no-underline hover:underline">
            ← All projects
          </Link>

          <div className="mt-[34px] mb-[15px] font-mono text-[10px] tracking-[0.16em] text-note uppercase">
            {eyebrow}
          </div>
          <h1 className="max-w-text text-[clamp(28px,3.4vw,40px)] leading-[1.16] font-light tracking-[-0.018em]">
            {title}
          </h1>
          <p className="mt-[22px] max-w-text text-[18px] text-body">{lede}</p>

          {repo && (
            <a
              href={repo}
              target="_blank"
              rel="noreferrer"
              className="mt-[24px] inline-block border-b border-accent pb-1 font-mono text-[12px] text-accent no-underline"
            >
              Source on GitHub ↗
            </a>
          )}

          {children}
        </div>
      </main>
    </>
  );
}
