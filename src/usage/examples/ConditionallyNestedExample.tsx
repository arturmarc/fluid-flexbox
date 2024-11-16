import { BookIcon, FileIcon, PanelBottomIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { FluidFlexbox } from "../../react/FluidFlexbox";

export function ConditionallyNestedExample() {
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
    <FluidFlexbox className="gap-2">
      {(isWidestWrapped) =>
        !isWidestWrapped ? (
          contentWhenWidest
        ) : (
          <FluidFlexbox className="gap-2" wrappedClass="gap-1">
            {(isNarrowerWrapped) =>
              !isNarrowerWrapped ? contentWhenNarrower : narrowestContent
            }
          </FluidFlexbox>
        )
      }
    </FluidFlexbox>
  );
}
