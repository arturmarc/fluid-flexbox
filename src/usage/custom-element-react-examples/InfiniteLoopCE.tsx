import { Button } from "../../components/ui/button";
import { FlexWrapDetector } from "../FlexWrapDetector";

export function InfiniteLoopCE() {
  return (
    <div className="flex gap-2">
      <div>Inside a flex container</div>
      <FlexWrapDetector
        class="flex-grow"
        setWrappedContent={(el) => {
          const toChange = el.querySelector("#to_change");
          if (toChange) {
            toChange.innerHTML = "THIRD EXPANDED";
          }
        }}
      >
        <div className="gap-2">
          <Button>First</Button>
          <Button>Second</Button>
          <Button id="to_change">Third</Button>
        </div>
      </FlexWrapDetector>
    </div>
  );
}
