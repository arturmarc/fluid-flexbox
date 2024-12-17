import { Button } from "../../components/ui/button";
import { FlexWrapDetector } from "../FlexWrapDetector";

export function BasicUsageExampleCE() {
  return (
    <FlexWrapDetector wrapped-class="flex-col">
      <div className="flex gap-2">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </div>
    </FlexWrapDetector>
  );
}
