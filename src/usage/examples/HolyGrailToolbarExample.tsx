import { Menu } from "lucide-react";
import { FluidFlexbox } from "../../react/FluidFlexbox";

export function HolyGrailToolbarExample() {
  return (
    <FluidFlexbox containerClassName="w-full">
      {(isOuterWrapped) => (
        <>
          <FluidFlexbox className="flex-grow" containerClassName="flex-grow">
            {(isInnerWrapped) => (
              <>
                {isInnerWrapped && (
                  <div className="flex flex-grow justify-end">
                    <Menu size="40" />
                  </div>
                )}
                {!isInnerWrapped && (
                  <div
                    className={`flex flex-grow flex-wrap justify-between gap-2 ${isOuterWrapped ? "flex-col" : ""}`}
                  >
                    <div className="flex flex-grow justify-between gap-2">
                      <Item>Home</Item>
                      <Item>Gallery</Item>
                      <Item>Blog</Item>
                    </div>
                    <div className="flex flex-grow justify-between gap-2">
                      <Item>FAQ</Item>
                      <Item>Contact</Item>
                      <Item>About</Item>
                    </div>
                  </div>
                )}
                {isOuterWrapped && <div className="h-[1px]"></div>}
              </>
            )}
          </FluidFlexbox>
          <div className="h-[1px]"></div>
        </>
      )}
    </FluidFlexbox>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <a
      className="min-w-0 flex-1 basis-1/3 px-4 py-2 text-center text-secondary-foreground underline hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      href="#"
      onClick={(e) => e.preventDefault()}
    >
      {children}
    </a>
  );
}
