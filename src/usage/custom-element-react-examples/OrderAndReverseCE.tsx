import { Button } from "../../components/ui/button";
import { FlexWrapDetector } from "../FlexWrapDetector";

export function OrderAndReverseCE() {
  return (
    <FlexWrapDetector wrapped-class="flex-col">
      <div className="h-40 flex-row-reverse gap-2">
        <Button>First</Button>
        <Button className="order-3">Second</Button>
        <Button>Third</Button>
      </div>
    </FlexWrapDetector>
  );
}
