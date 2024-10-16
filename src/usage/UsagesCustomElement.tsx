import { useEffect, useRef } from "react";
import { FluidFlexbox } from "../react/FluidFlexbox";
import { Button, UsageTitle, UsageWrapper } from "./UsageList";
import { FlexWrapDetectorElement } from "../dom/FlexWrapDetectorElement";

export function CESimpleUsage() {
  return (
    <UsageWrapper
      usageInfo={
        <UsageTitle subtitle="Using a custom element">
          Custom element
        </UsageTitle>
      }
    >
      <>
        <FlexWrapDetector
          setWrappingContent={(el) => {
            const secondChild = el.childNodes[1];
            if ("innerHTML" in secondChild) {
              secondChild.innerHTML += " wrapping";
            }
            el.className += " bg-red-200 flex-col";
          }}
        >
          <div className="w-fit gap-2 border border-solid border-neutral-200 p-2">
            <Button>First one</Button>
            <Button>Second one</Button>
          </div>
        </FlexWrapDetector>
      </>
    </UsageWrapper>
  );
}

export function CENestedUsage() {
  return (
    <UsageWrapper
      usageInfo={
        <UsageTitle subtitle="Nest other Flexboxes">Nested buttons</UsageTitle>
      }
    >
      <FlexWrapDetector
        className="outer"
        setWrappingContent={(el) => {
          const toChange = [...el.querySelectorAll("[data-change-me]")].filter(
            (el) => !el.closest("[data-flex-wrap-detector-invisible]"),
          );
          if (toChange[0]) {
            toChange[0].innerHTML = "Second collapsed";
          }
          el.className += " flex-col bg-red-200";
        }}
      >
        <div className="w-fit gap-2 border border-solid border-neutral-200 p-2">
          <FlexWrapDetector
            className="inner"
            wrapping-class="flex-col bg-red-200"
          >
            <div className="justify-between gap-2">
              <Button>First one</Button>
              <Button id="change-me" data-change-me>
                Second one
              </Button>
            </div>
          </FlexWrapDetector>

          <FlexWrapDetector wrapping-class="flex-col">
            <div className="flex justify-between gap-2">
              <Button>Third one</Button>
              <Button>And a last one</Button>
            </div>
          </FlexWrapDetector>
        </div>
      </FlexWrapDetector>
    </UsageWrapper>
  );
}

export function CEGrowEvenColumns() {
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
      <flex-wrap-detector wrapping-class="flex-col">
        <div className="gap-2">
          <Button className="min-w-[calc(33.3%-0.5rem)] flex-grow">
            First
          </Button>
          <Button className="min-w-[calc(33.3%-0.5rem)] flex-grow">
            Second long label
          </Button>
          <Button className="min-w-[calc(33.3%-0.5rem)] flex-grow">
            3 But
          </Button>
        </div>
      </flex-wrap-detector>
    </UsageWrapper>
  );
}

export function CEFlexShrink() {
  return (
    <UsageWrapper
      usageInfo={
        <UsageTitle subtitle="Collapsing when content">
          Column allowed to shrink
        </UsageTitle>
      }
    >
      <flex-wrap-detector wrapping-class="flex-col">
        <div className="flex-shrink gap-2">
          <div className="flex-1 border border-white p-2">
            Some pretty long content
          </div>
          <div className="flex-1 border border-white p-2">
            only wraps when the longest word
          </div>
          <div className="flex-1 border border-white p-2">
            in each column no longer fits
          </div>
        </div>
      </flex-wrap-detector>
    </UsageWrapper>
  );
}

export function CESettingHeight() {
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
      <flex-wrap-detector wrapping-class="flex-col justify-evenly items-stretch">
        <div className="h-40 max-w-sm items-center justify-center gap-2 border border-solid border-neutral-200 p-2">
          <Button>First one</Button>
          <Button>Second button</Button>
        </div>
      </flex-wrap-detector>
    </UsageWrapper>
  );
}

export function CEOneElement() {
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
      <FlexWrapDetector
        setWrappingContent={(el) => {
          const child = el.children[0];
          if (child) {
            child.innerHTML = "But";
          }
        }}
      >
        <div>
          <Button>Long button text</Button>
          <div className="h-[1px]"></div>
        </div>
      </FlexWrapDetector>
    </UsageWrapper>
  );
}

export function CENestedConditionally() {
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
      <flex-wrap-detector>
        <div className="gap-2" slot="wrapping-content">
          <flex-wrap-detector>
            <div className="gap-2" slot="wrapping-content">
              {narrowestContent}
            </div>
            <div className="gap-2">{contentWhenNarrower}</div>
          </flex-wrap-detector>
        </div>
        <div className="gap-2">{contentWhenWidest}</div>
      </flex-wrap-detector>
    </UsageWrapper>
  );
}

export function CEDeeplyNested() {
  return (
    <UsageWrapper
      usageInfo={
        <UsageTitle subtitle="Shrink multiple buttons in sequence">
          Deep nesting
        </UsageTitle>
      }
    >
      <FlexWrapDetector
        className="outer"
        setWrappingContent={(el) => {
          const toChange = [
            ...el.querySelectorAll(":scope > [data-change-me]"),
          ];
          if (toChange[0]) {
            toChange[0].innerHTML = "X";
          }
        }}
      >
        <div className="gap-2 overflow-hidden">
          <Button data-change-me>Close</Button>
          <FlexWrapDetector
            setWrappingContent={(el: HTMLElement) => {
              const toChange = el.children[0];
              console.log(el, toChange, "heeere");
              if (toChange) {
                console.log("changed");
                toChange.innerHTML = "+";
              }
            }}
          >
            <div className="gap-2">
              <Button data-change-me>New</Button>
              <FlexWrapDetector
                className="inner"
                setWrappingContent={(el: HTMLElement) => {
                  const toChange = el.children[1];
                  console.log(el, toChange, "heeere we go");
                  if (toChange) {
                    toChange.innerHTML = "-";
                  }
                }}
              >
                <div>
                  <div className="h-[1px] w-[1px]"></div>
                  <Button className="ml-[-1px]">Delete</Button>
                </div>
              </FlexWrapDetector>
            </div>
          </FlexWrapDetector>
        </div>
      </FlexWrapDetector>
    </UsageWrapper>
  );
}

export function PreventFauc() {
  return (
    <UsageWrapper
      usageInfo={
        <UsageTitle subtitle="Prevent Flash of Unstyled Content by adding overflow-hidden to the wrapper">
          Preventing Fouc
        </UsageTitle>
      }
    >
      {(debug) => (
        <>
          <FluidFlexbox __debug__={debug} className="mb-6 gap-2">
            {(isOverflowing) => (
              <>
                <Button>Will move around</Button>
                <Button>{isOverflowing ? "2" : "Second one"}</Button>
              </>
            )}
          </FluidFlexbox>
          <FluidFlexbox
            __debug__={debug}
            className="gap-2"
            containerClassName="overflow-hidden"
          >
            {(isOverflowing) => (
              <>
                <Button>Fauc prevented</Button>
                <Button>{isOverflowing ? "2" : "Second one"}</Button>
              </>
            )}
          </FluidFlexbox>
        </>
      )}
    </UsageWrapper>
  );
}

function FlexWrapDetector(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<FlexWrapDetectorElement>,
    FlexWrapDetectorElement
  > & {
    setWrappingContent?: (e: HTMLElement) => void;
  },
) {
  const detectorRef = useRef<FlexWrapDetectorElement | null>(null);
  const { setWrappingContent, ...rest } = props;

  useEffect(() => {
    if (!setWrappingContent) return;

    const handleSetWrappingContent = ((e: CustomEvent) => {
      setWrappingContent?.(e.detail.element);
    }) as EventListener; // todo remove the need to do this

    if (detectorRef.current) {
      detectorRef.current.addEventListener(
        "set-wrapping-content",
        handleSetWrappingContent,
      );
    }
    return () => {
      if (detectorRef.current) {
        detectorRef.current.removeEventListener(
          "set-wrapping-content",
          handleSetWrappingContent,
        );
      }
    };
  }, [detectorRef, setWrappingContent]);

  return (
    <flex-wrap-detector
      ref={detectorRef}
      {...rest}
      {...(setWrappingContent ? { "set-wrapping-content": true } : {})}
    />
  );
}
