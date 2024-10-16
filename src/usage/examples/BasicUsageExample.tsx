import { Button } from "../../components/ui/button";
import { FluidFlexbox } from "../../react/FluidFlexbox";

export function BasicUsageExample() {
  return (
    <FluidFlexbox className="gap-2" wrappedClass="flex-col">
      <Button>First</Button>
      <Button>Second</Button>
      <Button>Third</Button>
    </FluidFlexbox>
  );
}
