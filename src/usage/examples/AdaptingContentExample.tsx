import { Button } from "../../components/ui/button";
import { FluidFlexbox, useFluidFlexboxWrapped } from "../../react/FluidFlexbox";

export function AdaptingContentExample() {
  return (
    <div className="flex flex-col gap-6">
      <FluidFlexbox className="gap-2">
        {(isWrapped) => (
          <>
            <Button>Remove</Button>
            <Button>Extra</Button>
            {!isWrapped && <Button>Button</Button>}
          </>
        )}
      </FluidFlexbox>
      <Toolbar />
    </div>
  );
}

function Buttons() {
  const isWrapped = useFluidFlexboxWrapped();
  return (
    <>
      <Button>Remove</Button>
      <Button>Extra</Button>
      {!isWrapped && <Button>Button</Button>}
    </>
  );
}

function Toolbar() {
  return (
    <FluidFlexbox className="gap-2">
      <Buttons />
    </FluidFlexbox>
  );
}
