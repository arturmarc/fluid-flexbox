import React, {
  HTMLAttributes,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import useResizeObserver from "use-resize-observer";
import { throttle } from "../utils/throttle";

const THROTTLE_TIME = 0;

interface FluidFlexboxProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  throttleTime?: number;
  children?: React.ReactNode | ((isWrapped: boolean) => ReactNode);
  classWhenWrapped?: string;
  styleWhenWrapped?: React.CSSProperties;
  replaceWhenWrapped?: boolean; // todo implement this "mode" to fully override class and style when wrapped
  hidden?: boolean;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
}

interface Size {
  width: number | undefined;
  height: number | undefined;
}

export function MaybeFluidFlexbox({
  children,
  throttleTime = THROTTLE_TIME,
  style,
  className,
  classWhenWrapped,
  styleWhenWrapped,
  containerClassName,
  containerStyle,
  hidden,
  ...rest
}: FluidFlexboxProps) {
  const [isWrapped, setIsWrapped] = useState(false);
  const [nonWrappingSize, setNonWrappingSize] = useState({ w: 0, h: 0 });
  const [wrappingSize, setWrappingSize] = useState({ w: 0, h: 0 });

  // todo.. whe wrapped it keeps re-rendering ? why ?
  console.log("redenr FFxbox");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onNowrapResize = useCallback(
    throttle(({ width, height }: Size) => {
      if (width === undefined || height === undefined) return;
      setNonWrappingSize({ w: width, h: height });
      checkOverflowing();
    }, throttleTime),
    [throttleTime],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onWrappingResize = useCallback(
    throttle(({ width, height }: Size) => {
      if (width === undefined || height === undefined) return;
      setWrappingSize({ w: width, h: height });
      checkOverflowing();
    }, throttleTime),
    [throttleTime],
  );

  const onContainerResize = useCallback(
    throttle(({ width, height }: Size) => {
      if (width === undefined || height === undefined) return;
      console.log("onContainerResize", width, height);
      checkOverflowing();
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

  const checkOverflowing = useCallback(() => {
    if (nonWrappingSize.h === wrappingSize.h) {
      const lastChildNonWrapping = notWrappingCopyRef.current
        ?.lastElementChild as HTMLElement;
      const lastChildWrapping = wrappingCopyRef.current
        ?.lastElementChild as HTMLElement;
      console.log("lastChildNonWrapping", lastChildNonWrapping?.offsetTop);
      console.log("lastChildWrapping", lastChildWrapping?.offsetTop);
      console.log(
        " is wrapped ;)",
        lastChildNonWrapping &&
          lastChildWrapping &&
          lastChildNonWrapping.offsetTop !== lastChildWrapping.offsetTop,
        // TODO ? for row-reverse it's the other way around
      );
      if (lastChildNonWrapping && lastChildWrapping) {
        setIsWrapped(
          lastChildNonWrapping.offsetTop !== lastChildWrapping.offsetTop,
        );
      }
    } else {
      setIsWrapped(nonWrappingSize.h !== wrappingSize.h);
    }
  }, []);

  const baseStyle = {
    ...style,
    display: "flex",
  };
  const invisibleStyle = {
    ...baseStyle,
    flexDirection: "row" as const,
    visibility: "visible" as const,
  };

  let computedClassName = className;
  if (classWhenWrapped && isWrapped) {
    computedClassName = `${className || ""} ${classWhenWrapped}`.trim();
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
        display: hidden ? "none" : "grid", //grid to create a "pile" of elements
        position: "relative",
        ...styleSizeReset,
      }}
    >
      <div
        // nested flex-boxes inside the gird "pile" are the ones actually changing the size
        data-fluid-flexbox="invisible-non-wrapping"
        style={{
          gridArea: "1/1",
          // position: "absolute",
          // inset: 0,
          // needed so the hidden clone does not expand the container
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
          {children && typeof children === "function"
            ? children(false)
            : children}
        </div>
      </div>
      <div
        data-fluid-flexbox="invisible-wrapping"
        style={{
          position: "absolute", // needed so the hidden clone does not expand the container
          inset: 0,
          // needed so the hidden clone does not expand the container
          overflow: "hidden",
          ...styleSizeReset,
          zIndex: 1,
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
          {children && typeof children === "function"
            ? children(false)
            : children}
        </div>
      </div>
      <div
        data-fluid-flexbox="non-wrapping"
        style={{
          gridArea: "1/1",
          ...(!isWrapped
            ? {
                position: "absolute",
                inset: 0,
              }
            : {}),
          ...styleSizeReset,
          visibility: isWrapped ? "hidden" : "visible",
        }}
      >
        <div
          {...rest}
          className={computedClassName}
          ref={(el) => {
            wrappingCopyRef.current = el;
            wrappingCopyRefCb(el);
          }}
          style={{
            ...(isWrapped ? styleWhenWrapped : {}),
            gridArea: "1/1",
            overflow: "hidden",
            ...baseStyle,
            flexWrap: "nowrap",
            // old version ?? either this or overflow: hidden
            // so it doesn't expand the container
            // ...(isWrapped ? {} : { flexWrap: "wrap" }),
            // now when wrepped visiblity hidden and ...
          }}
        >
          {children && typeof children === "function"
            ? children(isWrapped)
            : children}
        </div>
      </div>
    </div>
  );
}
