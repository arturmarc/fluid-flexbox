import { StopCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { FlexWrapDetector } from "../FlexWrapDetector";

export function SingleChildExampleCE() {
  return (
    <FlexWrapDetector>
      <div>
        <Button>Long button</Button>
        <div className="h-[1px]"></div>
      </div>
      <div slot="wrapped-content">
        <Button>
          <StopCircle />
        </Button>
      </div>
    </FlexWrapDetector>
  );
}
