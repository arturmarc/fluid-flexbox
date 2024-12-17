import { Button } from "../../components/ui/button";
import { FlexWrapDetector } from "../FlexWrapDetector";

export function AdaptingContentExampleCE() {
  return (
    <FlexWrapDetector
      wrapped-class="flex-col"
      setWrappedContent={(el) => {
        const child = el.querySelector("#to-remove");
        if (child) child.textContent = "Wrapped";
      }}
    >
      <div className="flex gap-2">
        <Button>Remove</Button>
        <Button>Extra</Button>
        <Button id="to-remove">Button</Button>
      </div>
    </FlexWrapDetector>
  );
}
