import Sidebar from "@/components/Sidebar";
import SentinelPanel from "@/components/SentinelPanel";
import ProjectCards from "@/components/ProjectCards";
import ThesisTable from "@/components/ThesisTable";
import ThesisGeometry from "@/components/art/ThesisGeometry";
import { SITE_URL } from "./site";

const PERSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rishav Raj",
  jobTitle: "AI / ML Engineer",
  url: SITE_URL,
  email: "mailto:rrishavrraj@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Patna",
    addressRegion: "Bihar",
    addressCountry: "IN",
  },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Central University of Rajasthan" },
  sameAs: ["https://github.com/dLounce", "https://linkedin.com/in/ris7av"],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_LD) }}
      />
      <Sidebar />
      <main
        id="main"
        tabIndex={-1}
        className={[
          "ml-side px-[46px] max-[900px]:ml-0 max-[900px]:px-[22px]",
          "[&>*]:mx-auto [&>*]:max-w-col max-[900px]:[&>*]:max-w-none",
          "[&>section]:border-b [&>section]:border-rule [&>section]:py-[76px]",
          "[&>section:first-of-type]:pt-[100px]",
          "[&>section:last-of-type]:border-b-0",
        ].join(" ")}
      >
        <section id="intro">
          <h1 className="animate-rise max-w-[18ch] text-[clamp(32px,4.6vw,52px)] leading-[1.13] font-light tracking-[-0.018em] [animation-delay:50ms]">
            I train LLMs, deploy them, and test where they <em className="font-bold italic">fail</em>.
          </h1>

          <p className="animate-rise mt-[26px] max-w-text text-[18px] text-body [animation-delay:130ms]">
            I fine-tuned a 7B text-to-SQL model on execution reward, quantized it from about 15 GB
            down to 4.4 GB, and served it on a CPU instance that returns a query in about twelve
            seconds.
          </p>

          <p className="animate-rise mt-[15px] max-w-text text-[18px] text-body [animation-delay:210ms]">
            The rest of my work is testing where these systems fail. I built a procurement agent
            where the part that reads untrusted vendor text has no way to place an order, then ran a
            hundred prompt-injection attacks at it: twelve measurably shifted the buyer&apos;s
            decision, none produced an order. My M.Sc. thesis is a negative result &mdash; the
            merging method I set out to use collapsed into plain averaging. Each of those started
            with a number I didn&apos;t like.
          </p>

          <dl className="animate-rise mt-9 grid max-w-text grid-cols-2 gap-x-8 gap-y-5 border-t border-rule pt-6 min-[560px]:grid-cols-4 [animation-delay:250ms]">
            {[
              ["66.0%", "deployed text-to-SQL execution accuracy"],
              ["4.4 GB", "served model, down from ~15 GB"],
              ["~12 s", "one measured request · EC2 CPU"],
              ["0 / 100", "unauthorised orders · 100 live attacks"],
            ].map(([v, k]) => (
              <div key={k}>
                <dt className="font-mono text-[22px] font-light tracking-[-0.01em] text-ink tabular-nums">
                  {v}
                </dt>
                <dd className="mt-1 font-mono text-[12px] leading-[1.5] tracking-[0.04em] text-note uppercase">
                  {k}
                </dd>
              </div>
            ))}
          </dl>

          <a href="#sentinel" className="animate-rise mt-8 inline-block border-b border-accent pb-1 font-mono text-[12px] text-accent no-underline [animation-delay:290ms]">
            What happens when you remove the controls ↓
          </a>
        </section>


        <section id="sentinel">
          <div className="mb-[15px] font-mono text-[11.5px] tracking-[0.16em] text-note uppercase">
            Sentinel Procurement · adversarial evaluation
          </div>
          <h2 className="mb-[9px] max-w-text text-[26px] font-light tracking-[-0.012em]">
            The agent that reads vendor text <em className="font-bold italic">can&apos;t buy
            anything</em>. The agent that can buy never reads it.
          </h2>
          <p className="mb-[15px] max-w-text text-[17px] text-mute">
            The Interpreter handles vendor messages and has no tools and no network. The Buyer
            places orders but only ever sees a validated{" "}
            <span className="font-mono text-[14px]">VendorOffer</span> object, so free text never
            reaches it. Orders then clear four checks with no model in them: budget ceiling, price
            floor, extraction flags, delivery window.
          </p>
          <p className="mb-[26px] max-w-text text-[17px] text-mute">
            S0, S1 and S2 below are broken on purpose. Each removes one control, and each lets the
            attack through. Without them, &quot;no attack succeeded&quot; would only tell you the
            attacks were weak.
          </p>

          <SentinelPanel />

          <p className="mt-[15px] font-mono text-[12px] leading-[1.85] text-note">
            Every cell is a matched pair. The control records the vendor&apos;s real messages, the
            treatment replays them with only the attack payload added, and a second control replay
            sets the threshold an effect has to clear. These are observed rates from completed
            trials, not a claim that the real rate is zero.
          </p>
        </section>

        <section id="projects">
          <div className="mb-[26px] font-mono text-[11.5px] tracking-[0.16em] text-note uppercase">
            Projects
          </div>
          <ProjectCards />

          <p className="mt-[24px] max-w-text font-mono text-[12px] leading-[1.9] text-note">
            Stack – Python · PyTorch · Hugging Face · PEFT/LoRA · TRL/GRPO · LangGraph ·
            FastAPI · llama.cpp · AWS EC2 · MLflow · CloudWatch · PM4Py · Docker · SQL
          </p>
        </section>

        <section id="thesis">
          <div className="mb-[15px] font-mono text-[11.5px] tracking-[0.16em] text-note uppercase">
            KD-TIES · M.Sc. thesis, June 2026
          </div>
          <h2 className="mb-[9px] max-w-text text-[26px] font-light tracking-[-0.012em]">
            TIES merging quietly degenerates to <em className="font-bold italic">averaging</em>.
            This is the geometry that causes it.
          </h2>
          <p className="mb-[15px] max-w-text text-[17px] text-mute">
            Distilling Qwen2.5-32B into 7B, then merging the LoRA adapters, I expected TIES sign
            election to resolve conflicts between an instruction adapter and a maths adapter. It
            resolved nothing. Sign conflict measured 0.000.
          </p>
          <p className="mb-[26px] max-w-text text-[17px] text-mute">
            A cross-manifold task vector{" "}
            <span className="font-mono text-[14px]">τ = θ_LoRA_on_target − θ_base</span> carries the
            whole instruct-tuning shift inside it. That anchor dwarfs the LoRA signal, so both
            vectors point almost the same way and TIES has nothing left to arbitrate. SC-TIES
            subtracts the anchor, merges the residuals, then restores it, bringing sign conflict
            back to 0.237. OP-TIES projects out the shared top-16 subspace.
          </p>

          <ThesisGeometry />

          <ThesisTable />

          <p className="mt-[26px] max-w-text font-mono text-[12px] leading-[1.85] text-note">
            What I&apos;d do differently: I measured sign conflict only after the merge failed to
            help. Instrumented from the first run, the diagnosis would have taken days instead of
            weeks. I was watching the benchmark score when the zero was the louder signal.
          </p>
        </section>

        <section id="experience">
          <div className="mb-[15px] font-mono text-[11.5px] tracking-[0.16em] text-note uppercase">
            Experience &amp; education
          </div>
          <dl className="max-w-text">
            {[
              {
                role: "Artificial Intelligence Intern",
                org: "Ballistic Learning Systems",
                when: "Jun–Jul 2025",
                note: "Built an LLM short-answer grader and raised agreement with human graders from 44% to 71% on a 118-item benchmark.",
              },
              {
                role: "M.Sc. Computer Science",
                org: "Central University of Rajasthan",
                when: "Jun 2026",
                note: "CGPA 7.1/10. Thesis on task-vector merging under distillation (KD-TIES).",
              },
              {
                role: "BCA",
                org: "Patliputra University",
                when: "2021",
                note: "73%.",
              },
            ].map((r, i) => (
              <div
                key={r.role}
                className={`grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-hair py-[13px] ${i === 0 ? "border-t border-t-rule" : ""}`}
              >
                <dt className="text-[16px] text-ink">{r.role}</dt>
                <span className="text-right font-mono text-[11.5px] tracking-[0.08em] text-note uppercase">
                  {r.when}
                </span>
                <dd className="col-span-2 text-[14px] text-mute">
                  <span className="text-body">{r.org}</span> – {r.note}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="contact">
          <div className="mb-[15px] font-mono text-[11.5px] tracking-[0.16em] text-note uppercase">
            Contact
          </div>
          <h2 className="mb-[9px] max-w-text text-[26px] font-light tracking-[-0.012em]">
            If you&apos;re hiring for LLM deployment, evaluation, or <em className="font-bold italic">agent
            systems</em>, I&apos;d like to hear about it.
          </h2>
          <p className="mb-[32px] max-w-text text-[17px] text-mute">
            I&apos;m looking for AI/ML engineering roles in LLM deployment, evaluation, or agent
            systems. I finished my M.Sc. in June 2026, I&apos;m based in Patna and open to
            relocation, and available now. Email or LinkedIn both reach me.
          </p>

          <dl>
            {[
              { k: "Email", v: "rrishavrraj@gmail.com", href: "mailto:rrishavrraj@gmail.com" },
              { k: "LinkedIn", v: "linkedin.com/in/ris7av", href: "https://linkedin.com/in/ris7av" },
              { k: "GitHub", v: "github.com/dLounce", href: "https://github.com/dLounce" },
              { k: "Résumé", v: "Rishav_Resume.pdf", href: "/resume/Rishav_Resume.pdf" },
              { k: "Phone", v: "+91 97983 41208", href: "tel:+919798341208" },
              { k: "Based in", v: "Patna, Bihar, India", href: null },
            ].map((row, i) => (
              <div
                key={row.k}
                className={`grid grid-cols-[96px_1fr] items-baseline gap-4 border-b border-hair py-[11px] ${i === 0 ? "border-t border-t-rule" : ""}`}
              >
                <dt className="font-mono text-[11px] tracking-[0.12em] text-note uppercase">{row.k}</dt>
                <dd className="font-mono text-[12.5px] [overflow-wrap:anywhere]">
                  {row.href ? (
                    <a href={row.href} {...(row.href.startsWith("http") || row.href.endsWith(".pdf") ? { target: "_blank", rel: "noreferrer" } : {})} className="text-accent no-underline hover:underline">
                      {row.v}
                    </a>
                  ) : (
                    <span className="text-body">{row.v}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

        </section>
      </main>
    </>
  );
}
