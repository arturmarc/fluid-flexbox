import { useRef, useEffect } from "react";
import { FlexWrapDetectorElement } from "../dom/FlexWrapDetectorElement";

export function FlexWrapDetector(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<FlexWrapDetectorElement>,
    FlexWrapDetectorElement
  > & {
    setWrappedContent?: (e: HTMLElement) => void;
    class?: string;
  },
) {
  const detectorRef = useRef<FlexWrapDetectorElement | null>(null);
  const { setWrappedContent, ...rest } = props;

  useEffect(() => {
    if (!setWrappedContent) return;

    const handleSetWrappedContent = ((e: CustomEvent) => {
      setWrappedContent?.(e.detail.element);
    }) as EventListener; // todo remove the need to do this

    if (detectorRef.current) {
      detectorRef.current.addEventListener(
        "set-wrapped-content",
        handleSetWrappedContent,
      );
    }
    return () => {
      if (detectorRef.current) {
        detectorRef.current.removeEventListener(
          "set-wrapped-content",
          handleSetWrappedContent,
        );
      }
    };
  }, [detectorRef, setWrappedContent]);

  return <flex-wrap-detector ref={detectorRef} {...rest} />;
}
