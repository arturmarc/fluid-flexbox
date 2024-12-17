import { Button } from "../../components/ui/button";
import { FlexWrapDetector } from "../FlexWrapDetector";

export function NestedExampleCE() {
  return (
    <FlexWrapDetector
      class="w-full"
      wrapped-class="flex-col"
      id="outer"
      suppress-warning
    >
      <div className="w-full gap-2">
        <FlexWrapDetector
          wrapped-class="flex-col"
          class="flex-grow"
          id="inner1"
        >
          <div className="justify-between gap-2">
            <Button className="flex-1" id="first">
              First
            </Button>
            <Button className="flex-1">Second</Button>
          </div>
        </FlexWrapDetector>
        <FlexWrapDetector
          wrapped-class="flex-col"
          class="flex-grow"
          id="inner2"
          suppress-warning
        >
          <div className="flex flex-grow justify-between gap-2">
            <Button className="flex-1">Third</Button>
            <Button className="flex-1">Fourth</Button>
          </div>
        </FlexWrapDetector>
      </div>
    </FlexWrapDetector>
  );
}
