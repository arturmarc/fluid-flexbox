import { PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { FluidFlexbox } from "../../react/FluidFlexbox";

export function DeepNestingExample() {
  return (
    <FluidFlexbox className="gap-2">
      {(outerIsWrapped) => (
        <>
          <Button> {outerIsWrapped ? <XIcon size="20" /> : "Close"}</Button>
          <FluidFlexbox className="gap-2">
            {(innerIsWrapped) => (
              <>
                <Button>
                  {innerIsWrapped ? <PlusIcon size="20" /> : "New"}
                </Button>
                <FluidFlexbox>
                  {(innermostIsWrapped) => (
                    <>
                      <Button>
                        {innermostIsWrapped ? (
                          <TrashIcon size="20" />
                        ) : (
                          "Delete"
                        )}
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
