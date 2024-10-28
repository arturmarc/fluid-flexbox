import { Button } from "../../components/ui/button";
import { FluidFlexbox } from "../../react/FluidFlexbox";

export function OrderAndReverse() {
  return (
    <FluidFlexbox
      className="h-40 flex-row-reverse gap-2"
      wrappedClass="flex-col"
    >
      <Button>First</Button>
      <Button className="order-3">Second</Button>
      <Button>Third</Button>
    </FluidFlexbox>
  );
}
