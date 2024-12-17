import { StopCircle } from "lucide-react";
import { FluidFlexbox } from "../../react/FluidFlexbox";

export function SmallerHeight() {
  return (
    <FluidFlexbox>
      {(isWrapped) => (
        <>
          <div className="px-4">
            {isWrapped ? (
              <StopCircle />
            ) : (
              <>
                <p>Multi line long text example</p>
                <p>Multi line</p>
                <p>Multi line</p>
              </>
            )}
          </div>
          <div className="h-[1px]"></div>
        </>
      )}
    </FluidFlexbox>
  );
}
