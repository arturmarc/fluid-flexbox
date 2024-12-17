import { BookIcon, FileIcon, PanelBottomIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { FlexWrapDetector } from "../FlexWrapDetector";

export function ConditionallyNestedExampleCE() {
  const contentWhenWidest = (
    <>
      <Button>Longer</Button>
      <Button>Button</Button>
      <Button>Labels</Button>
    </>
  );
  const contentWhenNarrower = (
    <>
      <Button>Shrt</Button>
      <Button>But</Button>
      <Button>Lbl</Button>
    </>
  );
  const narrowestContent = (
    <>
      <Button className="flex-grow p-0.5">
        <BookIcon size="20" />
      </Button>
      <Button className="flex-grow p-0.5">
        <FileIcon size="20" />
      </Button>
      <Button className="flex-grow p-0.5">
        <PanelBottomIcon size="20" />
      </Button>
    </>
  );
  return (
    <FlexWrapDetector>
      <div className="gap-2">{contentWhenWidest}</div>
      <div slot="wrapped-content">
        <FlexWrapDetector>
          <div className="gap-2">{contentWhenNarrower}</div>
          <div slot="wrapped-content" className="gap-1">
            {narrowestContent}
          </div>
        </FlexWrapDetector>
      </div>
    </FlexWrapDetector>
  );
}
