import { DeleteIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { FluidFlexbox } from "../../react/FluidFlexbox";

export function DeepNestingExample() {
  return (
    <FluidFlexbox className="gap-2">
      {(isOverflowing) => (
        <>
          <Button> {isOverflowing ? <XIcon size="20" /> : "Close"}</Button>
          <FluidFlexbox className="gap-2">
            {(isOverflowing) => (
              <>
                <Button>
                  {" "}
                  {isOverflowing ? <PlusIcon size="20" /> : "New"}
                </Button>
                <FluidFlexbox>
                  {(isOverflowing) => (
                    <>
                      <Button>
                        {isOverflowing ? <TrashIcon size="20" /> : "Delete"}
                      </Button>
                      <div className="h-[1px]"></div>
                    </>
                  )}
                </FluidFlexbox>
              </>
            )}
          </FluidFlexbox>
        </>
      )}
    </FluidFlexbox>
  );
}
