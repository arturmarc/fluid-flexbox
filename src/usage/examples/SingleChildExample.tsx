import { StopCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { FluidFlexbox } from "../../react/FluidFlexbox";

export function SingleChildExample() {
  return (
    <FluidFlexbox>
      {(isWrapped) => (
        <>
          <Button>{isWrapped ? <StopCircle /> : "Long button"}</Button>
          <div className="h-[1px]"></div>
        </>
      )}
    </FluidFlexbox>
  );
}
