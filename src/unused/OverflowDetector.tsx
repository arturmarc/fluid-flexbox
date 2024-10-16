import {
  HTMLAttributes,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import useResizeObserver from "use-resize-observer";
import { throttle } from "../utils/throttle";

const THROTTLE_TIME = 0;

interface OverflowDetectorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  throttleTime?: number;
  children?: (isOverflowing: boolean) => ReactNode;
  overflowClass?: string;
  overflowStyle?: React.CSSProperties;
}

export function OverflowDetector({
  children,
  throttleTime = THROTTLE_TIME,
  style,
  className,
  overflowClass,
  overflowStyle,
  ...rest
}: OverflowDetectorProps) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [mainWrapperSize, setNonWrappingSize] = useState({ w: 0, h: 0 });
  const [invisibleCheckerSize, setInvisibleCheckerSize] = useState({
    w: 0,
    h: 0,
  });

  //todo remove throttle

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onMainWrapperResize = useCallback(
    throttle(
      ({
        width,
        height,
      }: {
        width: number | undefined;
        height: number | undefined;
      }) => {
        // console.log("onMainWrapperResize", height);
        if (width === undefined || height === undefined) return;
        setNonWrappingSize({ w: width, h: height });
      },
      throttleTime,
    ),
    [throttleTime],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onInvisibleCheckerResize = useCallback(
    throttle(
      ({
        width,
        height,
      }: {
        width: number | undefined;
        height: number | undefined;
      }) => {
        // console.log("onInvisibleCheckerResize", height);
        if (width === undefined || height === undefined) return;
        setInvisibleCheckerSize({ w: width, h: height });
      },
      throttleTime,
    ),
    [throttleTime],
  );

  const { ref: mainWrapperRef } = useResizeObserver<HTMLDivElement>({
    onResize: onMainWrapperResize,
  });
  const { ref: invisibleCheckerRef } = useResizeObserver<HTMLDivElement>({
    onResize: onInvisibleCheckerResize,
  });

  // in a span of time check how many times
  // the overflowing state changes..
  const numChanges = useRef(0);

  useLayoutEffect(() => {
    // console.log("OverflowDetector useLayoutEffect");
    // console.log("invisibleCheckerSize", invisibleCheckerSize);
    // console.log("mainWrapperSize", mainWrapperSize);

    // infinite loop detection

    const newIsOverflowing =
      invisibleCheckerSize.w > mainWrapperSize.w ||
      invisibleCheckerSize.h > mainWrapperSize.h;

    if (newIsOverflowing !== isOverflowing) {
      //   if (!numChanges.current) {
      //     setTimeout(() => {
      //       numChanges.current = 0;
      //     }, 100);
      //     return;
      //   }
      //   numChanges.current++;
      //   console.log("numChanges", numChanges.current);
      // setIsOverflowing(newIsOverflowing);
      console.log("changed");
    }

    setIsOverflowing(
      invisibleCheckerSize.w > mainWrapperSize.w ||
        invisibleCheckerSize.h > mainWrapperSize.h,
    );
    // setIsOverflowing(nonWrappingSize < wrappingSize);
  }, [invisibleCheckerSize, mainWrapperSize]);

  const debug = false;

  let computedClassName = className;
  if (overflowClass && isOverflowing) {
    computedClassName = `${className || ""} ${overflowClass}`.trim();
  }

  return (
    <div
      data-overflow-detector-role="main-wrapper"
      ref={mainWrapperRef}
      style={{
        overflow: "hidden", //probably not needed
        // just to make sure some css is not messing with sizing:
        padding: 0,
        margin: 0,
        border: 0,
        position: "relative",
        display: "grid",
      }}
    >
      <div
        data-overflow-detector-role="invisible-checker"
        ref={invisibleCheckerRef}
        style={{
          ...style,
          position: "absolute",
          top: 0,
          left: 0,
          // overflow: "hidden",
          // visibility: "hidden" as const,
          visibility: debug ? ("visible" as const) : ("hidden" as const),
        }}
      >
        <div
          {...rest}
          className={className}
          style={{
            ...style,
          }}
        >
          {children && children(false)}
        </div>
      </div>
      <div
        data-overflow-detector-role="visible-output-wrapper"
        // style={{ overflow: "hidden" }}
      >
        <div
          {...rest}
          className={computedClassName}
          style={{
            ...style,
            ...(isOverflowing ? overflowStyle : {}),
          }}
        >
          {children && children(isOverflowing)}
        </div>
      </div>
    </div>
  );
}
