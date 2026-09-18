import type { Metadata } from "next";
import ProjectShell, { H2, P, Facts } from "@/components/ProjectShell";

export const metadata: Metadata = {
  title: "Multimodal deepfake detection (DGM4) — Rishav Raj",
  description:
    "Detecting and grounding image-text manipulation on DGM4: real/fake detection, image bbox and text-token localisation, built on CLIP with LoRA.",
};

export default function DGM4() {
  return (
    <ProjectShell
      eyebrow="DGM4 · Dec 2025–Feb 2026"
      title="It flags the manipulated face region and names the altered words."
      lede="Real or fake is the easy half. This model also localises the manipulated face as a bounding box and identifies which caption tokens were changed, with one percent of the parameters trained."
      repo="https://github.com/dLounce/dgm4-multimodal-detection"
    >
      <Facts
        rows={[
          ["Architecture", "CLIP ViT-L + LoRA · LLaVA-7B · PyTorch"],
          ["Data", "208K image–caption pairs"],
          ["Trained parameters", "4.3M of 432M (1%) · LoRA + heads"],
          ["Detection", "0.965 AUC · 0.903 accuracy"],
          ["Manipulation type", "0.911 mAP"],
          ["Face localisation", "0.892 mIoU · face bounding box"],
          ["Manipulated words", "0.831 F1"],
          ["Frozen-CLIP baseline", "0.862 AUC · 0.724 accuracy"],
        ]}
      />

      <H2>What the baseline says</H2>
      <P>
        A frozen CLIP encoder reaches 0.862 AUC on its own, so most of the detection signal is
        already sitting in the pretrained representation. The training adds 0.103 AUC on top of
        that, plus the grounding heads, which frozen CLIP cannot produce at all.
      </P>

      <H2>Two-way cross-attention</H2>
      <P>
        Image patches attend to caption tokens and caption tokens attend back to image patches, so
        the model can learn that a particular phrase disagrees with a particular region. That is
        what makes token-level and box-level localisation possible instead of one real/fake logit.
      </P>

      <H2>The weakest head, stated as an open question</H2>
      <P>
        Word-level grounding is the weakest of the three heads: 0.831 F1 on manipulated words against
        0.965 detection AUC. Detection only has to call the pair fake; naming the exact altered
        tokens is a harder, sparser target, with few positive tokens per caption. I do not have an
        experiment that isolates the cause &mdash; token imbalance, the capacity given to that head,
        or the cross-attention resolution are all candidates &mdash; so I record it as an open
        limitation rather than explain it after the fact.
      </P>
    </ProjectShell>
  );
}
