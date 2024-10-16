import { useState } from "react";
import {
  DeeplyNested,
  FlexShrink,
  GrowEvenColumns,
  NotLoosingState,
  NestedConditionally,
  NestedUsage,
  Nothing,
  OneElement,
  PreventFauc,
  SettingHeight,
  SimpleUsage,
} from "./Usages";
import {
  CEDeeplyNested,
  CEFlexShrink,
  CEGrowEvenColumns,
  CENestedConditionally,
  CENestedUsage,
  CEOneElement,
  CESettingHeight,
  CESimpleUsage,
} from "./UsagesCustomElement";

export function UsageList() {
  return (
    <div>
      <div className="mt-4">
        <SimpleUsage />
        {/* <Nothing /> */}
        {/* <CESimpleUsage /> */}
        {/* <NestedUsage /> */}
        {/* <CENestedUsage /> */}
        {/* <GrowEvenColumns /> */}
        {/* <CEGrowEvenColumns /> */}
        {/* <FlexShrink /> */}
        {/* <CEFlexShrink /> */}
        {/* <SettingHeight /> */}
        {/* <CESettingHeight /> */}
        {/* <OneElement /> */}
        {/* <CEOneElement /> */}
        <DeeplyNested />
        {/* <PreventFauc /> */}
        {/* <CEDeeplyNested /> */}
        {/* <NestedConditionally /> */}
        {/* <CENestedConditionally /> */}
        {/* <NotLoosingState /> */}
        {/* ?? <wrapperdisplay and wrapperClassName /> */}
      </div>
    </div>
  );
}

export function UsageWrapper({
  children,
  usageInfo,
}: {
  children: React.ReactNode | ((debug: boolean) => React.ReactNode);
  usageInfo: React.ReactNode;
}) {
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
      <div className="min-w-72">{usageInfo}</div>
      <div className="flex resize flex-col gap-2 overflow-hidden rounded-xl border-2 border-solid border-white p-4">
        {typeof children === "function" ? children(debug) : children}
      </div>
    </div>
  );
}

export function UsageTitle({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <>
      <h3 className="text-left font-semibold">{children}</h3>
      <div className="pb-2">{subtitle}</div>
    </>
  );
}

export function Button({
  onClick,
  className,
  children,
  ...rest
}: JSX.IntrinsicElements["button"]) {
  return (
    <button
      className={`rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 ${className || ""}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
