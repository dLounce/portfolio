import Sidebar from "@/components/Sidebar";
import SentinelPanel from "@/components/SentinelPanel";
import ProjectCards from "@/components/ProjectCards";
import ThesisTable from "@/components/ThesisTable";

export default function Home() {
  return (
    <>
      <Sidebar />
      <main
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
            I build LLM systems that can be lied to and still <em className="font-bold italic">refuse</em>.
          </h1>

          {/* ---------------------------------------------------------------
              TODO(rishav) — HANDOVER §9.3. Written from the
              sentinel-procurement README, so it is factual, but it is not
              your voice yet. Replace the first sentence with what you
              actually remember about building it.
             --------------------------------------------------------------- */}

          <p className="animate-rise mt-[26px] max-w-text text-[18px] text-body [animation-delay:130ms]">
            My last project was a procurement system where two agents negotiate with vendors and
            neither one is allowed to authorise a purchase. Then I ran a hundred prompt-injection
            attacks at it. Twelve of them changed how the buying agent reasoned. None produced an
            order.
          </p>

          <p className="animate-rise mt-[15px] max-w-text text-[18px] text-body [animation-delay:210ms]">
            Most of what I build is measurement: a red-team harness with a control group in it, a
            SQL model post-trained on execution reward and scored against 21 databases it had never
            seen, a thesis whose main finding is that the method I set out to use doesn&apos;t work.
            Each of those started with a number I didn&apos;t like.
          </p>

          <a href="#sentinel" className="animate-rise mt-8 inline-block border-b border-accent pb-1 font-mono text-[12px] text-accent no-underline [animation-delay:290ms]">
            What happens when you remove the controls ↓
          </a>
        </section>


        <section id="sentinel">
          <div className="mb-[15px] font-mono text-[10px] tracking-[0.16em] text-note uppercase">
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

          <p className="mt-[15px] font-mono text-[10.5px] leading-[1.85] text-note">
            Every cell is a matched pair. The control records the vendor&apos;s real messages, the
            treatment replays them with only the attack payload added, and a second control replay
            sets the threshold an effect has to clear. These are observed rates from completed
            trials, not a claim that the real rate is zero.
          </p>
        </section>

        <section id="projects">
          <div className="mb-[26px] font-mono text-[10px] tracking-[0.16em] text-note uppercase">
            Projects
          </div>
          <ProjectCards />
        </section>

        <section id="thesis">
          <div className="mb-[15px] font-mono text-[10px] tracking-[0.16em] text-note uppercase">
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

          <ThesisTable />

          <p className="mt-[26px] max-w-text font-mono text-[10.5px] leading-[1.85] text-note">
            What I&apos;d do differently: I measured sign conflict only after the merge failed to
            help. Instrumented from the first run, the diagnosis would have taken days instead of
            weeks. I was watching the benchmark score when the zero was the louder signal.
          </p>
        </section>

        <section id="contact">
          <div className="mb-[15px] font-mono text-[10px] tracking-[0.16em] text-note uppercase">
            Contact
          </div>
          <h2 className="mb-[9px] max-w-text text-[26px] font-light tracking-[-0.012em]">
            If you&apos;re hiring someone to make agents <em className="font-bold italic">survive</em> production,
            I&apos;d like to hear about it.
          </h2>
          <p className="mb-[32px] max-w-text text-[17px] text-mute">
            AI or agent engineering: post-training, LLM systems, agent security. I finished my
            M.Sc. in June 2026, I&apos;m available now, and I&apos;ll relocate. Email or LinkedIn
            both reach me.
          </p>

          <dl>
            {[
              { k: "Email", v: "rrishavrraj@gmail.com", href: "mailto:rrishavrraj@gmail.com" },
              { k: "LinkedIn", v: "linkedin.com/in/ris7av", href: "https://linkedin.com/in/ris7av" },
              { k: "GitHub", v: "github.com/dLounce", href: "https://github.com/dLounce" },
              { k: "Phone", v: "+91 97983 41208", href: "tel:+919798341208" },
              { k: "Based in", v: "Patna, Bihar, India", href: null },
            ].map((row, i) => (
              <div
                key={row.k}
                className={`grid grid-cols-[96px_1fr] items-baseline gap-4 border-b border-hair py-[11px] ${i === 0 ? "border-t border-t-rule" : ""}`}
              >
                <dt className="font-mono text-[9.5px] tracking-[0.12em] text-note uppercase">{row.k}</dt>
                <dd className="font-mono text-[12.5px]">
                  {row.href ? (
                    <a href={row.href} {...(row.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})} className="text-accent no-underline hover:underline">
                      {row.v}
                    </a>
                  ) : (
                    <span className="text-body">{row.v}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-[38px] font-mono text-[10.5px] leading-[1.85] text-note">
            Currently shipping: the Text-to-SQL demo on this site, a write-up of the KD-TIES
            negative result, MCP tool-calling at agent runtime in Log2Agent.
          </p>
        </section>
      </main>
    </>
  );
}
