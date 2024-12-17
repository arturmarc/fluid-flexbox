import React from "react";
import { Button } from "../../components/ui/button";
import { FlexWrapDetector } from "../FlexWrapDetector";

export function DynamicContentExampleCE() {
  const [altTxt, setAltTxt] = React.useState(false);

  return (
    <FlexWrapDetector wrapped-class="flex-col">
      <div className="flex gap-2">
        <Button onClick={() => setAltTxt(!altTxt)}>
          Click to Toggle content
        </Button>
        <Button>{!altTxt ? "Short" : "Very Looong Content"}</Button>
      </div>
    </FlexWrapDetector>
  );
}
