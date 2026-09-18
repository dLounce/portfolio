"use client";

import { useEffect, useState } from "react";

const NAV = [
  { href: "/#intro", label: "Intro", paths: ["M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1z"] },
  { href: "/#sentinel", label: "Sentinel", paths: ["M12 3l8 3v6c0 4.9-3.4 8-8 9-4.6-1-8-4.1-8-9V6z", "M9 12l2 2 4-4"] },
  { href: "/#projects", label: "Projects", paths: ["M3 7h18v13H3z", "M8 7V4h8v3"] },
  { href: "/#thesis", label: "Thesis", paths: ["M4 4h11l5 5v11H4z", "M15 4v5h5"] },
  { href: "/#experience", label: "Experience", paths: ["M3 8h18v11a1 1 0 01-1 1H4a1 1 0 01-1-1z", "M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"] },
  { href: "/#contact", label: "Contact", paths: ["M3 6h18v12H3z", "M3 7l9 6 9-6"] },
];

export default function SideNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll("main section[id]");
    if (sections.length === 0) return; // project pages: no section to spy on

    // default before the observer reports; sections only exist on the home page
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive("/#intro");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`/#${e.target.id}`);
        }),
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="mt-[26px] flex flex-col gap-px max-[900px]:mt-4 max-[900px]:flex-row max-[900px]:overflow-x-auto">
      {NAV.map((item) => {
        const on = active === item.href;
        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={on ? "location" : undefined}
            className={[
              "flex items-center gap-[10px] rounded-[5px] px-[11px] py-2",
              "font-mono text-[12.5px] no-underline transition-colors duration-150",
              on ? "bg-ink text-card" : "text-mute hover:bg-hover hover:text-ink",
            ].join(" ")}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-[13px] w-[13px] flex-none fill-none stroke-current"
              strokeWidth={1.6}
            >
              {item.paths.map((d) => (
                <path key={d} d={d} />
              ))}
            </svg>
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
