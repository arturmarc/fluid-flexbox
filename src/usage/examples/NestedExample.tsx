import { Button } from "../../components/ui/button";
import { FluidFlexbox } from "../../react/FluidFlexbox";

export function NestedExample() {
  return (
    <FluidFlexbox
      className="w-full gap-2"
      wrappedClass="flex-col"
      containerClassName="w-full"
    >
      {(isWrapped) => (
        <>
          <FluidFlexbox
            className="justify-between gap-2"
            wrappedClass="flex-col"
            containerClassName="flex-grow"
          >
            <Button className="flex-1">
              {isWrapped ? "Wrapped" : "First"}
            </Button>
            <Button className="flex-1">Second</Button>
          </FluidFlexbox>
          <FluidFlexbox
            className="flex justify-between gap-2"
            wrappedClass="flex-col"
            containerClassName="flex-grow"
          >
            <Button className="flex-1">Third</Button>
            <Button className="flex-1">Fourth</Button>
          </FluidFlexbox>
        </>
      )}
    </FluidFlexbox>
  );
}
