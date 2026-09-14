import type { Metadata } from "next";
import ProjectShell, { H2, P, Note, Facts } from "@/components/ProjectShell";
import SentinelPanel from "@/components/SentinelPanel";

export const metadata: Metadata = {
  title: "Sentinel Procurement — Rishav Raj",
  description:
    "A privilege-separated multi-agent procurement system and the adversarial evaluation that tests whether vendor text can push a model-driven Buyer into an unauthorised purchase.",
};

export default function Sentinel() {
  return (
    <ProjectShell
      eyebrow="Sentinel Procurement · security evaluation"
      title="Two agents negotiate with vendors. Neither is allowed to authorise a purchase."
      lede="The question is whether vendor text can push a real, model-driven Buyer into an order it should not place. Across 100 live attacks on the defended architecture it never did. Three deliberately weakened versions of the same system are in the experiment, and those do fail, which is what makes the first number worth anything."
      repo="https://github.com/dLounce/sentinel-procurement"
    >
      <Facts
        rows={[
          ["Live runs", "100 replications, 10 attack families"],
          ["Unauthorised actions", "0 of 100"],
          ["Policy violations", "0 of 100"],
          ["Model influence", "12 of 100 moved the Buyer past the noise band"],
          ["Deterministic matrix", "25 cells, offline, no API calls"],
          ["Matrix unauthorised", "3 of 25, all in S0, S1, S2"],
          ["Causal metrics", "0 of 19 evaluated cells, 6 not evaluable"],
          ["Tests", "310 passing"],
        ]}
      />

      <H2>How it is put together</H2>
      <P>
        The Interpreter reads untrusted vendor text and has no tools and no network, so it cannot
        act on anything it reads. The Buyer can act but never sees that text. It receives validated
        VendorOffer objects and nothing else, and separate processes and credentials enforce the
        split rather than instructions in a prompt.
      </P>
      <P>
        Before an order exists it clears checks that contain no model: schema and extraction-flag
        validation, the budget ceiling, a configured absolute price floor, and the max-delivery
        constraint. place_order re-runs those itself and returns nothing if any fail.
      </P>
      <P>
        Schema validation alone is not enough, which is what the price floor is for. A perfectly
        well-formed VendorOffer describing a $1 SUV is still a $1 SUV. The floor is set per
        scenario, supplied independently of vendor responses, and never derived from vendor text.
      </P>

      <H2>Where the models sit</H2>
      <P>
        The Buyer and the Vendors are genuinely model-driven, which is the only reason the result
        means anything. The Buyer runs a small LangGraph loop over the round&apos;s validated offers
        and emits a structured BuyerDecision: accept, counter, reject, or walk_away. It never calls
        place_order. The authorisation layer decides independently what is allowed, so a confused or
        compromised Buyer has nothing to talk its way past.
      </P>

      <H2>The ablation</H2>
      <P>
        Saying no attack succeeded is a claim about the attacks as much as the defence. The matrix
        answers that by running the same payload against four architectures, three of which are
        supposed to break.
      </P>

      <SentinelPanel />

      <Note>
        S0 sends raw vendor text straight to the Buyer with no boundary and no gate. S1 adds only a
        prompt-level warning. S2 restores the typed boundary but bypasses the place_order gate. Each
        variant removes exactly one control, so the failures say which control was carrying the
        weight.
      </Note>

      <H2>Twelve out of a hundred</H2>
      <P>
        In the live runs, twelve attacks shifted the Buyer&apos;s reasoning-level decision past the
        benign noise band. In the sense that mattered to the model, they worked. None became an
        unauthorised action or a policy violation, because the layer that authorises is not the
        layer that was persuaded.
      </P>
      <P>
        Twelve is a more useful number than zero would have been. If nothing had moved the model at
        all, the only safe conclusion would be that the attacks were too weak to test anything.
      </P>

      <H2>How a cell is measured</H2>
      <P>
        Every attack is a matched pair on the real negotiation path. The control records the exact
        vendor commercial messages. The treatment replays those same messages and adds only the
        attacker&apos;s payload at the configured round, so the attack is the single variable. An
        A/A-prime run replays the control messages a second time to measure ordinary run-to-run
        variation, which sets the threshold an effect has to clear.
      </P>
      <P>
        Ground truth about which case is an attack lives in the harness. The runtime Buyer,
        Interpreter and Vendors never receive it. The 25 cells cover the attack families, three
        timings, three attacker positions, one to three-vendor collusion, and the S0 through S3
        variants, all with scripted doubles so the matrix reproduces offline for free.
      </P>

      <H2>What broke</H2>
      <P>
        Two measurement bugs, both caught during the build and both now covered by regression tests.
      </P>
      <P>
        The causal metrics were originally divided by all 25 cells, including cells that never run
        the A/A-prime comparison: the collusion cells, the architecture ablations, and the bounded
        adaptive cell. Those can never register a positive, so counting them quietly pulled the rate
        towards zero. The denominator is now the 19 cells where influence was actually evaluated,
        and the 6 excluded ones are listed by name. That is why the figure reads 0 of 19 rather than
        a tidier looking 0 of 25.
      </P>
      <P>
        The second bug was in trials where the negotiation ended before the attack round. The
        payload was never delivered, but the trial was still scored as a non-influence result, so
        benign early closes counted as evidence the defence worked. Those are now marked
        attack-not-reached and left out of scoring.
      </P>
      <P>
        Both bugs moved the numbers in the flattering direction, which is the direction you are
        least likely to go looking in.
      </P>
      <Note>
        TODO(rishav) — finish this in your own words. A reader will want to know which of the two
        you found first and what made you go looking.
      </Note>

      <H2>What it does not claim</H2>
      <P>
        These are observed rates from completed trials, not a claim that the true attack success
        probability is zero. The matrix gives repeatable, wide coverage with scripted doubles and
        the live runs check behaviour against real models on a focused subset. Neither substitutes
        for the other, which is why they are reported separately.
      </P>
      <P>
        Whether a vendor&apos;s quoted price is truthful is a commercial question rather than a
        security property. The guards read an offer&apos;s own price and flags against configured
        policy. They do not compare a vendor&apos;s claim against other vendors or against hidden
        truth, and they never read the offer&apos;s confidence score.
      </P>

      <Note>
        Reproduce the offline pilot with{" "}
        <span className="text-body">python -m eval.adversarial.run_pilot</span>, which uses
        deterministic doubles and makes no API calls. The live evaluation runs through
        eval/adversarial/live_runner.py and needs provider keys. Live outputs are git-ignored on
        purpose.
      </Note>
    </ProjectShell>
  );
}
