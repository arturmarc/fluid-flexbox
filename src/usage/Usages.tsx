import { FluidFlexbox } from "../react/FluidFlexbox";
import { Button, UsageTitle, UsageWrapper } from "./UsageList";

export function SimpleUsage() {
  return (
    <UsageWrapper
      usageInfo={
        <UsageTitle subtitle="With css and content changing">
          Simple buttons
        </UsageTitle>
      }
    >
      <div className="flex gap-2">
        <div> first element</div>
        <FluidFlexbox
          className="gap-2 border border-solid border-neutral-200 p-2"
          // wrappedClass="flex-col bg-red-200"
          containerClassName="bg-green-500"
        >
          {(isOverflowing) => (
            <>
              <Button className="flex-groww">First one</Button>
              <Button className="shrink-0">
                Second{" "}
                {isOverflowing
                  ? "collapsed collapsed collapsed collapsed"
                  : "one"}
              </Button>
            </>
          )}
        </FluidFlexbox>
      </div>
    </UsageWrapper>
  );
}

export function Nothing() {
  return (
    <UsageWrapper
      usageInfo={
        <UsageTitle subtitle="Nothing to wrap">
          Without anything should just work as regular flex container
        </UsageTitle>
      }
    >
      <FluidFlexbox className="gap-2">
        <Button>First one</Button>
        <Button>Second one</Button>
      </FluidFlexbox>
    </UsageWrapper>
  );
}

export function NestedUsage() {
  return (
    <UsageWrapper
      usageInfo={
        <UsageTitle subtitle="Nest other Flexboxes">Nested buttons</UsageTitle>
      }
    >
      <FluidFlexbox
        className="w-fit gap-2 border border-solid border-neutral-200 p-2"
        wrappedClass="flex-col bg-red-200"
      >
        {(isWrapped) => (
          <>
            <FluidFlexbox
              className="justify-between gap-2"
              wrappedClass="flex-col"
            >
              <Button>First one</Button>
              <Button>Second {isWrapped ? "collapsed" : "one"}</Button>
            </FluidFlexbox>
            <FluidFlexbox
              className="flex justify-between gap-2"
              wrappedClass="flex-col"
            >
              <Button>Third one</Button>
              <Button>And a last one</Button>
            </FluidFlexbox>
          </>
        )}
      </FluidFlexbox>
    </UsageWrapper>
  );
}

export function GrowEvenColumns() {
  return (
    <UsageWrapper
      usageInfo={
        <UsageTitle
          subtitle="Columns growing evenly and collapsing as soon as one of their
              content does not fit"
        >
          Growing even columns
        </UsageTitle>
      }
    >
      <FluidFlexbox className="gap-2" wrappedClass="flex-col">
        <Button className="min-w-[calc(33.3%-0.5rem)] flex-grow">First</Button>
        <Button className="min-w-[calc(33.3%-0.5rem)] flex-grow">
          Second long label
        </Button>
        <Button className="min-w-[calc(33.3%-0.5rem)] flex-grow">3 But</Button>
      </FluidFlexbox>
    </UsageWrapper>
  );
}

export function FlexShrink() {
  return (
    <UsageWrapper
      usageInfo={
        <UsageTitle subtitle="Collapsing when content">
          Column allowed to shrink
        </UsageTitle>
      }
    >
      <FluidFlexbox className="flex-shrink gap-2" wrappedClass="flex-col">
        {/* <div className="flex flex-shrink flex-wrap gap-2"> */}
        <div className="flex-1 border border-white p-2">
          Some pretty long content
        </div>
        <div className="flex-1 border border-white p-2">
          only wraps when the longest word
        </div>
        <div className="flex-1 border border-white p-2">
          in each column no longer fits
        </div>
      </FluidFlexbox>
    </UsageWrapper>
  );
}

export function SettingHeight() {
  return (
    <UsageWrapper
      usageInfo={
        <UsageTitle
          subtitle={<>Even with fixed height collapse can be detected</>}
        >
          Setting fixed and max width
        </UsageTitle>
      }
    >
      <FluidFlexbox
        className="h-40 max-w-sm items-center justify-center gap-2 border border-solid border-neutral-200 p-2"
        wrappedClass="flex-col justify-evenly items-stretch"
      >
        <Button>First one</Button>
        <Button>Second button</Button>
      </FluidFlexbox>
    </UsageWrapper>
  );
}

export function OneElement() {
  return (
    <UsageWrapper
      usageInfo={
        <UsageTitle
          subtitle="Using extra empty flex item to detect if a single element is
                overflowing"
        >
          Just one element
        </UsageTitle>
      }
    >
      <FluidFlexbox>
        {(isOverflowing) => (
          <>
            <Button>{isOverflowing ? "But" : "Long button"}</Button>
            <div className="h-[1px]"></div>
          </>
        )}
      </FluidFlexbox>
    </UsageWrapper>
  );
}

export function NestedConditionally() {
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
      <Button className="flex-grow">S</Button>
      <Button className="flex-grow">B</Button>
      <Button className="flex-grow">L</Button>
    </>
  );

  return (
    <UsageWrapper
      usageInfo={
        <UsageTitle subtitle="Alternate nesting levels. Different content at each level">
          Conditionally nested
        </UsageTitle>
      }
    >
      <FluidFlexbox className="gap-2" containerClassName="overflow-hidden">
        {(isOverflowing) =>
          !isOverflowing ? (
            contentWhenWidest
          ) : (
            <FluidFlexbox
              className="gap-2"
              containerClassName="overflow-hidden"
              wrappedClass="flex-wrap"
            >
              {(narrowerIsOverflowing) =>
                !narrowerIsOverflowing ? contentWhenNarrower : narrowestContent
              }
            </FluidFlexbox>
          )
        }
      </FluidFlexbox>
    </UsageWrapper>
  );
}

export function DeeplyNested() {
  return (
    <UsageWrapper
      usageInfo={
        <UsageTitle subtitle="Shrink multiple buttons in sequence">
          Deep nesting
        </UsageTitle>
      }
    >
      <FluidFlexbox className="gap-2" containerClassName="overflow-hiddenn">
        {(isOverflowing) => (
          <>
            <Button> {isOverflowing ? "X" : "Close"}</Button>
            <FluidFlexbox
              className="gap-2"
              containerClassName="overflow-hiddenn"
            >
              {(isOverflowing) => (
                <>
                  <Button> {isOverflowing ? "+" : "New"}</Button>
                  <FluidFlexbox containerClassName="overflow-hiddenn">
                    {(isOverflowing) => (
                      <>
                        <Button>{isOverflowing ? "-" : "Delete"}</Button>
                        <div className="h-[1px]"></div>
                      </>
                    )}
                  </FluidFlexbox>
                </>
              )}
            </FluidFlexbox>
          </>
        )}
      </FluidFlexbox>
    </UsageWrapper>
  );
}

export function NotLoosingState() {
  return (
    <UsageWrapper
      usageInfo={
        <UsageTitle subtitle="With many buttons">With many buttons</UsageTitle>
      }
    >
      <FluidFlexbox className="gap-2">
        {(isOverflowing) => (
          <>
            <input></input>
            <Button>{isOverflowing ? "Submit" : "Loooong submit label"}</Button>
          </>
        )}
      </FluidFlexbox>
    </UsageWrapper>
  );
}
