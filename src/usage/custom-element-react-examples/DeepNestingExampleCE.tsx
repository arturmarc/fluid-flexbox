import { PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { FlexWrapDetector } from "../FlexWrapDetector";

export function DeepNestingExampleCE() {
  // can be used for all levels of nesting
  // hide text and show icon
  const handleSetWrappedContent = (el: HTMLElement) => {
    const butTxt = el.querySelector("button > span") as HTMLElement | null;
    if (butTxt) {
      butTxt.style.display = "none";
    }
    const butIcon = el.querySelector("button > svg") as HTMLElement | null;
    if (butIcon) {
      butIcon.style.display = "block";
    }
  };

  return (
    <FlexWrapDetector
      setWrappedContent={handleSetWrappedContent}
      id="outer"
      suppress-warning
    >
      <div className="gap-2">
        <Button>
          <XIcon size="20" style={{ display: "none" }} />
          <span>Close</span>
        </Button>
        <FlexWrapDetector
          setWrappedContent={handleSetWrappedContent}
          id="inner"
          suppress-warning
        >
          <div className="gap-2">
            <Button>
              <PlusIcon size="20" style={{ display: "none" }} />
              <span>New</span>
            </Button>
            <FlexWrapDetector setWrappedContent={handleSetWrappedContent}>
              <div>
                <Button>
                  <TrashIcon size="20" style={{ display: "none" }} />
                  <span>Delete</span>
                </Button>
                <div className="h-[1px]"></div>
              </div>
            </FlexWrapDetector>
          </div>
        </FlexWrapDetector>
      </div>
    </FlexWrapDetector>
  );
}
