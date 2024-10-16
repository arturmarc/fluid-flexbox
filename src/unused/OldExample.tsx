import { Button } from "../usage/UsageList";

export function OldExamples() {
    const [debug, setDebug] = useState(false);

return (
  <div>
    <label className="flex gap-4 p-4">
      <input
        type="checkbox"
        checked={debug}
        onChange={() => setDebug(!debug)}
      />
      <span>Debug</span>
    </label>
    <div className="hidden w-full resize overflow-hidden rounded-xl border-2 border-solid border-white p-10">
      {/* <div className="grid border-2 border-solid border-white">
          <div className="col-start-1 row-start-1">Some content</div>
          <div className="col-start-1 row-start-1">Another content on top</div>
        </div> */}

      <div className="flex flex-wrap gap-2 border-2 border-solid border-white">
        <div className="w-20 grow border border-solid border-white p-2">
          Some content
        </div>
        <div className="w-20 grow border border-solid border-white p-2">
          Another content on top
        </div>
      </div>
    </div>

    <div className="hidden">
      <div className="flex gap-4 p-4">
        <Button onClick={() => setNumBoxes((numBoxes) => numBoxes - 1)}>
          -
        </Button>
        <Button onClick={() => setNumBoxes((numBoxes) => numBoxes + 1)}>
          +
        </Button>
      </div>

      <div className="hidden w-full resize overflow-hidden rounded-xl border-2 border-solid border-white p-10">
        {/* <FluidFlexbox
            className="w-full gap-4"
            overflowClass="flex-col"
            throttleTime={0}
          > */}
        <OverflowDetector className="flex gap-4" overflowClass="flex-col">
          {(isOverflowing) => (
            <>
              {Array.from({ length: numBoxes }, (_, i) => {
                const w = isOverflowing ? "w-full" : "w-24";
                const h = isOverflowing ? "h-12" : "h-24";
                return (
                  <div
                    key={i}
                    className={`border-3 animate-fade-in ${h} ${w} rounded-xl border-white bg-green-600`}
                  ></div>
                );
              })}
            </>
          )}
        </OverflowDetector>
        {/* </FluidFlexbox> */}
      </div>
    </div>

    <div className="mt-6 hidden w-full resize items-center overflow-hidden rounded-xl border-2 border-solid border-white p-5">
      <OverflowDetector
        className="flex gap-2 p-5"
        overflowClass="flex-col align stretch"
      >
        {() => (
          <>
            <OverflowDetector className="flex gap-2" overflowClass="flex-col">
              {() => (
                <>
                  <Button>Button one</Button>
                  <Button>Another button</Button>
                </>
              )}
            </OverflowDetector>
            <OverflowDetector className="flex gap-2" overflowClass="flex-col">
              {() => (
                <>
                  <Button>Third one</Button>
                  <Button>And a last one</Button>
                </>
              )}
            </OverflowDetector>
          </>
        )}
      </OverflowDetector>
    </div>

    <div className="hidden w-full resize overflow-hidden rounded-xl border-2 border-solid border-white p-5">
      {
        // nested example
      }
      <FluidFlexbox
        className="w-full items-stretch gap-4 p-5"
        wrappedClass="bg-red-200 flex-col align-stretch"
        __debug__={debug}
      >
        {(isOverflowing) => (
          <>
            <FluidFlexbox
              __debug__={debug}
              className="w-full gap-2"
              wrappedClass="flex-col"
            >
              {/* <Button> */}
              <Button className={isOverflowing ? "flex-1" : ""}>
                First one
              </Button>
              {/* <Button> */}
              <Button className={isOverflowing ? "flex-1" : ""}>
                Second one
              </Button>
            </FluidFlexbox>

            <FluidFlexbox
              __debug__={debug}
              className="w-full gap-2"
              wrappedClass="flex-col"
            >
              {/* <div className="flex gap-2"> */}
              <Button>Third one</Button>
              <Button>And a last one</Button>
              {/* </div> */}
            </FluidFlexbox>
          </>
        )}
      </FluidFlexbox>

      <div className="mt-4 flex max-w-fit flex-wrap gap-2">
        <div className="mt-4 flex max-w-fit flex-wrap gap-2">
          <Button className="min-w-fit flex-1">First button</Button>
          <Button className="min-w-fit flex-1">Secondddd button</Button>
        </div>
        <div className="mt-4 flex max-w-fit flex-wrap gap-2">
          <Button className="min-w-fit flex-1">third button</Button>
          <Button className="min-w-fit flex-1">another one</Button>
        </div>
      </div>
    </div>

    <div className="m-t-6 hidden w-full resize overflow-hidden rounded-xl border-2 border-solid border-white p-5">
      {/* testing wrapping without fluid flexbox */}

      <FluidFlexbox className="gap-2" wrappedClass="flex-col" __debug__={debug}>
        <Button className="flex-1">First</Button>
        <Button className="flex-1">Third one</Button>
        <Button className="flex-1">And a last one</Button>
      </FluidFlexbox>

      <div className="hidden">
        <FluidFlexbox
          className="mt-4 gap-2"
          wrappedClass="flex-col"
          __debug__={debug}
        >
          <Button>First</Button>
          <Button>Second one</Button>
        </FluidFlexbox>
      </div>

      {/* testing the option to have text wrapping inside */}

      <FluidFlexbox
        className="w-full items-stretch gap-4 p-5"
        wrappedClass="bg-red-200 flex-col "
        __debug__={debug}
      >
        {(isOverflowing) => (
          <>
            <div className="color-white flex flex-1 items-center rounded-xl bg-indigo-500 p-6">
              Change container or inner styles
            </div>
            <div className="color-white flex flex-1 items-center rounded-xl bg-indigo-500 p-6">
              when content is overflowing
            </div>
            <div
              className={`color-white flex flex-1 items-center rounded-xl p-6 ${isOverflowing ? "bg-fuchsia-500" : "bg-indigo-500"}`}
            >
              {isOverflowing
                ? "something shorter"
                : "or even change text content to"}
            </div>
          </>
        )}
      </FluidFlexbox>
    </div>

    <div className="hidden w-full resize items-center overflow-hidden rounded-xl border-2 border-solid border-white p-5">
      {/* <FluidFlexbox
          className="w-full items-stretch gap-4 p-5"
          overflowClass="bg-red-200 flex-col "
        > */}
      <OverflowDetector
        className="flex w-full items-stretch gap-4 p-5"
        overflowClass="bg-red-200 flex-col "
      >
        {(isOverflowing) => (
          <>
            <div className="color-white flex flex-1 items-center rounded-xl bg-indigo-500 p-6">
              Change container or inner styles
            </div>
            <div className="h=1color-white flex flex-1 items-center rounded-xl bg-indigo-500 p-6">
              when content is overflowing
            </div>
            <div
              className={`color-white flex flex-1 items-center rounded-xl p-6 ${isOverflowing ? "bg-fuchsia-500" : "bg-indigo-500"}`}
            >
              {isOverflowing
                ? "something shorter"
                : "or even change text content to"}
            </div>
          </>
        )}
      </OverflowDetector>
      {/* </FluidFlexbox> */}
    </div>
  </div>
);
