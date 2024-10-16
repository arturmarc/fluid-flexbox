import React, {
  HTMLAttributes,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useResizeObserver from "use-resize-observer";
import { throttle } from "../utils/throttle";

const THROTTLE_TIME = 0;

export interface FluidFlexboxProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  throttleTime?: number;
  children?: React.ReactNode | ((wrapped: boolean) => ReactNode);
  wrappedClass?: string;
  wrappedStyle?: React.CSSProperties;
  // removeClassWhenWrapped?: boolean; // todo implement this "mode" to fully override class when wrapped
  hidden?: boolean;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
}

export interface FluidFlexboxContext {
  isWrapped: boolean;
}

const FluidFlexBoxContext = createContext<FluidFlexboxContext>({
  isWrapped: false,
});

export function useFluidFlexboxWrapped() {
  const { isWrapped } = useContext(FluidFlexBoxContext);
  return isWrapped;
}

export function FluidFlexbox({
  children,
  throttleTime = THROTTLE_TIME,
  style,
  className,
  wrappedClass,
  wrappedStyle,
  containerClassName,
  containerStyle,
  hidden,
  ...rest
}: FluidFlexboxProps) {
  const [isWrappedState, setIsWrapped] = useState(false);
  // locked is used to prevent infinite loops
  const [locked, setLocked] = useState(false);
  const isWrapped = locked ? true : isWrappedState;

  // use refs instead of state to avoid re-rendering
  const nonWrappingElHeight = useRef(0);
  const wrappingElHeight = useRef(0);

  console.log("redenr FFxbox", isWrapped);

  const onNowrapResize = useCallback(
    throttle(({ height }: { height: number | undefined }) => {
      if (height === undefined) {
        return;
      }
      nonWrappingElHeight.current = height;
      checkIfWrapping();
    }, throttleTime),
    [throttleTime],
  );

  const onWrappingResize = useCallback(
    throttle(({ height }: { height: number | undefined }) => {
      if (height === undefined) {
        return;
      }
      wrappingElHeight.current = height;
      checkIfWrapping();
    }, throttleTime),
    [throttleTime],
  );

  const onContainerResize = useCallback(
    throttle(() => {
      checkIfWrapping();
    }, throttleTime),
    [throttleTime],
  );

  const { ref: notWrappingCopyRefCb } = useResizeObserver<HTMLDivElement>({
    onResize: onNowrapResize,
  });
  const { ref: wrappingCopyRefCb } = useResizeObserver<HTMLDivElement>({
    onResize: onWrappingResize,
  });
  const { ref: containerRef } = useResizeObserver<HTMLDivElement>({
    onResize: onContainerResize,
  });

  const notWrappingCopyRef = useRef<HTMLDivElement | null>(null);
  const wrappingCopyRef = useRef<HTMLDivElement | null>(null);

  const checkIfWrapping = useCallback(() => {
    if (nonWrappingElHeight.current === wrappingElHeight.current) {
      const lastChildNonWrapping = notWrappingCopyRef.current
        ?.lastElementChild as HTMLElement;
      const lastChildWrapping = wrappingCopyRef.current
        ?.lastElementChild as HTMLElement;
      // TODO ? for row-reverse it's the other way around
      // if the direction is row-reverse or the last child is not one with the
      // greatest 'order' value
      if (lastChildNonWrapping && lastChildWrapping) {
        setIsWrapped(
          lastChildNonWrapping.offsetTop !== lastChildWrapping.offsetTop,
        );
      }
    } else {
      setIsWrapped(nonWrappingElHeight.current !== wrappingElHeight.current);
    }
  }, []);

  // inject global styles for styling children
  useEffect(() => {
    const styleId = "fluid-flexbox-style-rules";
    if (document.getElementById(styleId)) return;
    const styleEl = document.createElement("style");
    styleEl.id = styleId;
    // first rule is needed to make sure the children of the non-wrapping
    // hidden clone are not expanding the container horizontally
    // (without it the text inside might start wrapping to the next line)
    // second is similar, but it's needed to prevent fouc i.e. content wrapping
    // before the smaller content is rendered by react and visible
    styleEl.innerHTML = `
      [data-fluid-flexbox="invisible-non-wrapping"] > div > * {       
        flex-shrink: 0 !important;
      }
      [data-fluid-flexbox="visible-not-wrapped"] > div > * {
        flex-shrink: 0 !important;
      }
    `;
    document.head.appendChild(styleEl);
  }, []);

  // infinite loop prevention
  // lock down changes if re-rendered more
  // than 10 times in 200ms
  const renderCountRef = useRef(0);
  const lastResetTimeRef = useRef(Date.now());
  const timeWindow = 200;
  const threshold = 10;
  useEffect(() => {
    const now = Date.now();
    if (now - lastResetTimeRef.current > timeWindow) {
      renderCountRef.current = 1;
      lastResetTimeRef.current = now;
      setLocked(false);
    } else {
      renderCountRef.current += 1;
      console.log(
        "render count",
        renderCountRef.current,
        now - lastResetTimeRef.current,
      );
      if (renderCountRef.current > threshold) {
        setLocked(true);
        setIsWrapped(true);
      }
    }
  });

  const baseStyle = {
    ...style,
    display: "flex",
  };
  const invisibleStyle = {
    ...baseStyle,
    flexDirection: "row" as const,
    visibility: "hidden" as const,
  };

  let computedClassName = className;
  if (wrappedClass && isWrapped) {
    computedClassName = `${className || ""} ${wrappedClass}`.trim();
  }

  // just to make sure some inherited styles are not applied
  const styleSizeReset = {
    padding: 0,
    margin: 0,
    border: 0,
  };

  return (
    <div
      data-fluid-flexbox="container"
      ref={containerRef}
      className={containerClassName}
      style={{
        ...(containerStyle || {}),
        // grid to create a "pile" of elements, i.e. a way to stack elements without positioning absolutely
        display: hidden ? "none" : "grid",
        position: "relative",
        ...styleSizeReset,
      }}
    >
      <div
        // nested flex-boxes inside the gird "pile" are the ones actually changing the size
        data-fluid-flexbox="invisible-non-wrapping"
        style={{
          gridArea: "1/1",
          overflow: "hidden",
          ...styleSizeReset,
        }}
      >
        <div
          {...rest}
          className={className}
          ref={(el) => {
            notWrappingCopyRef.current = el;
            notWrappingCopyRefCb(el);
          }}
          style={{
            ...invisibleStyle,
            flexWrap: "nowrap",
          }}
        >
          <FluidFlexBoxContext.Provider value={{ isWrapped: false }}>
            {children && typeof children === "function"
              ? children(false)
              : children}
          </FluidFlexBoxContext.Provider>
        </div>
      </div>
      <div
        data-fluid-flexbox="invisible-wrapping"
        style={{
          // needed so the hidden clone does not expand the container
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          ...styleSizeReset,
          zIndex: -1,
        }}
      >
        <div
          {...rest}
          className={className}
          ref={(el) => {
            wrappingCopyRef.current = el;
            wrappingCopyRefCb(el);
          }}
          style={{
            ...invisibleStyle,
            flexWrap: "wrap",
          }}
        >
          <FluidFlexBoxContext.Provider value={{ isWrapped: false }}>
            {children && typeof children === "function"
              ? children(false)
              : children}
          </FluidFlexBoxContext.Provider>
        </div>
      </div>
      <div
        data-fluid-flexbox={`visible-${isWrapped ? "wrapped" : "not-wrapped"}`}
        style={{
          gridArea: "1/1",
          // this is needed to allow the visible to shrink below it's content size
          // could be solved by allowing wrapping but that creates a faus (see blow)
          // or it could be solved by overflow: "hidden",
          // this way is better tough, because user's might want the content
          // too bleed out of the container and overflow: "hidden" would prevent that
          ...(!isWrapped
            ? {
                position: "absolute",
                inset: 0,
              }
            : {}),
          ...styleSizeReset,
        }}
      >
        <div
          {...rest}
          className={computedClassName}
          style={{
            ...(isWrapped ? wrappedStyle : {}),
            ...baseStyle,
            // needed to prevent fouc
            // don't wrap because it will wrap first and only then
            // react will render the content and/or class to apply when wrapped
            // which often might results in a small jump in the content size
            ...(isWrapped ? {} : { flexWrap: "nowrap" }),
          }}
        >
          <FluidFlexBoxContext.Provider value={{ isWrapped }}>
            {children && typeof children === "function"
              ? children(isWrapped)
              : children}
          </FluidFlexBoxContext.Provider>
        </div>
      </div>
    </div>
  );
}
