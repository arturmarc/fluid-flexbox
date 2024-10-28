import { useEffect } from "react";
import { Button } from "../../components/ui/button";
import { FluidFlexbox } from "../../react/FluidFlexbox";

export function AllPropsShowcaseExample() {
  useEffect(() => {
    const styleId = "example-style-rules";
    if (document.getElementById(styleId)) return;
    const styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.innerHTML = `
      .redundant-class-to-remove {       
        border: 2px red solid;
        background-color: yellow;
      }
    `;
    document.head.appendChild(styleEl);
  }, []);

  return (
    <FluidFlexbox
      className="redundant-class-to-remove gap-2 p-4"
      wrappedClass="flex-col gap-1"
      containerStyle={{ border: "6px lightblue solid", display: "none" }} //display: none will not work - need "hidden"
      removeClassWhenWrapped
      wrappedStyle={{ border: "6px limegreen solid" }}
      throttleTime={150}
    >
      <Button>First</Button>
      <Button>Second</Button>
      <Button>Third</Button>
      <FluidFlexbox hidden>
        This will be hidden not affecting anything
      </FluidFlexbox>
    </FluidFlexbox>
  );
}
