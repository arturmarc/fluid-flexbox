import { Button } from "../../components/ui/button";
import { FluidFlexbox } from "../../react/FluidFlexbox";

export function InfiniteLoop() {
  return (
    <div className="flex gap-2">
      <div>Inside a flex container</div>
      <FluidFlexbox className="gap-2" containerClassName="flex-grow">
        {(isWrapped) => (
          <>
            <Button>First</Button>
            <Button>Second</Button>
            <Button>{isWrapped ? "THIRD EXPANDED" : "Third"}</Button>
          </>
        )}
      </FluidFlexbox>
    </div>
  );
}
