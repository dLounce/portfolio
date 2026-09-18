import type { Metadata } from "next";
import ProjectShell, { H2, P, Note, Facts } from "@/components/ProjectShell";
import TracePanel from "@/components/TracePanel";

export const metadata: Metadata = {
  title: "Log2Agent — Rishav Raj",
  description:
    "Mines an enterprise event log, ranks steps by automation ROI, compiles a LangGraph agent with human approval gates, and repairs its own generated code when it fails.",
};

export default function Log2Agent() {
  return (
    <ProjectShell
      eyebrow="Log2Agent · May–Jul 2026"
      title="It reads how a process actually runs, then writes the agent that automates it."
      lede="Rather than guess what to automate, Log2Agent mines an event log to pick the target, then grades the generated agent by replaying real cases against what actually happened."
      repo="https://github.com/dLounce/log2agent"
    >
      <Facts
        rows={[
          ["Dataset", "BPI Challenge 2020, Request for Payment"],
          ["Scale", "6,886 cases · 36,796 events"],
          ["Replay agreement", "50 / 50 cases matched historical routing"],
          ["Mined model", "fitness 1.0 · precision 0.29"],
          ["Median cycle time", "7.1 days on the replayed sample"],
          ["Median wait per hand-off", "29.3 hours"],
          ["Automated", "SUBMITTED · APPROVED by ADMINISTRATION"],
          ["Human-gated", "FINAL_APPROVED · Pay · Payment Handled"],
        ]}
      />

      <H2>What it actually does</H2>
      <P>
        Seven stages. It ingests an XES event log and reports data quality. PM4Py reconstructs the
        process as a directly-follows graph and a Petri net, including paths that appear nowhere in
        the official diagram. It measures hand-off wait time per step and cycle time per case. An
        LLM classifies each activity as deterministic, communication or judgment, and ROI is scored
        as frequency × median handling hours × cost × automatability, discounted by risk, with every
        assumption exposed as an editable slider.
      </P>
      <P>
        The chosen segment is then compiled: an LLM fills a locked Jinja2 template, the output is
        AST-checked and smoke-tested in a sandbox, and human-in-the-loop gates are auto-inserted on
        irreversible steps so the agent pauses for a person before any payment moves. Finally,
        historical cases are replayed through the generated agent and its routing outcome is
        compared against what actually happened.
      </P>

      <H2>The repair loop</H2>
      <P>
        If generated code fails its smoke test, a bounded ReAct agent debugs it with four tools:
        run_smoke_test, read_traceback, read_code and patch_code. It is capped at 5 iterations or 60
        seconds, then falls back to a plain retry. patch_code replaces one whole function and
        AST-validates the candidate before writing; an invalid patch is rejected rather than saved.
      </P>
      <P>
        The demo on the compile page injects a bug deliberately: it rewrites the first stub call
        from (state) to (stat), producing a NameError. The agent is not told what broke. In the
        captured run it found and fixed it in a single patch, with no retries.
      </P>

      <div className="my-[26px]">
        <TracePanel />
        <p className="mt-[9px] font-mono text-[11.5px] leading-[1.7] text-note">
          Nine events captured from a real run: smoke test fails, traceback read, broken function
          read, one patch applied, smoke test passes. Recorded rather than live: I chose not to
          expose arbitrary code execution to anonymous visitors.
        </p>
      </div>

      <H2>Scale</H2>
      <P>
        The BPI Challenge 2017 loan log, 1,202,267 events across 31,509 cases, mines end to end in
        roughly 50 minutes on a laptop at fitness 1.0. Results are cached so the app loads it
        instantly afterwards.
      </P>

      <H2>What is real and what is mocked</H2>
      <P>
        The generated agents run for real: executed, smoke-tested, interrupted at human gates, and
        replayed against history. The business APIs they call are mocks. Each node calls a stub that
        returns a plausible hardcoded response, and wiring this to a real system means replacing
        those stubs. MCP tool discovery happens at design time and grounds the feasibility scoring;
        the generated agents do not call MCP tools at runtime yet. LLM output is JSON-mode prompting
        with parsing, not schema-enforced structured output, kept deterministic at temperature 0.
        Validation compares routing outcomes, meaning whether the case completed through the same
        path, rather than the content of human decisions.
      </P>

      <H2>What broke, and what I&apos;d do differently</H2>
      <P>
        Mined precision is 0.29 on the 2020 log and 0.14 on the full 1.2M-event 2017 log. That looks
        bad until you know the Inductive Miner guarantees fitness and soundness at the cost of
        permissive models; 0.2–0.5 is normal on real logs with rework. I leaned on frequency and
        wait analytics plus outcome replay for the automation decision rather than on the Petri
        net&apos;s precision. I should have said so up front instead of leaving a number on the page
        that invites the wrong conclusion.
      </P>
      <P>
        The known gap is that MCP tools are discovered at design time and never called at runtime. I
        scoped it out for async lifecycle reasons and shipped without it. That is the next thing I
        would build, and it is the difference between a generated agent that demonstrates a workflow
        and one that performs it.
      </P>

      <Note>
        Data: BPI Challenge 2020, Request for Payment (van Dongen, B.F., 4TU.ResearchData). Licensed
        CC BY-NC 4.0, so the log is not redistributed here. The repository points you at 4TU to
        download it yourself. Repository code is MIT.
      </Note>
    </ProjectShell>
  );
}
