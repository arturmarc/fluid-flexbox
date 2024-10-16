import { ChevronsUpDownIcon } from "lucide-react";
import { ReactElement, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { BasicUsageExample } from "./examples/BasicUsageExample";
import { NestedExample } from "./examples/NestedExample";
import { Resizer } from "./Resizer";
import { AdaptingContentExample } from "./examples/AdaptingContentExample";
import { ConditionallyNestedExample } from "./examples/ConditionallyNestedExample";
import { DeepNestingExample } from "./examples/DeepNestingExample";
import { SingleChildExample } from "./examples/SingleChildExample";

export function ExampleSelector() {
  const [example, setExample] = useState("Basic Usage");

  const examples: Map<string, ReactElement> = useMemo(
    () =>
      new Map([
        ["Basic Usage", <BasicUsageExample />],
        ["Adapting content", <AdaptingContentExample />],
        ["Two levels of nesting", <NestedExample />],
        ["Conditionally nested", <ConditionallyNestedExample />],
        ["Deep nesting", <DeepNestingExample />],
        ["Single child", <SingleChildExample />],
      ]),
    [],
  );

  return (
    <>
      <div className="flex p-8 pl-0">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Example:</span>
              <span>{example}</span>
              <ChevronsUpDownIcon className="h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
            <DropdownMenuRadioGroup value={example} onValueChange={setExample}>
              {[...examples.keys()].map((example) => (
                <DropdownMenuRadioItem key={example} value={example}>
                  {example}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Resizer>{examples.get(example)}</Resizer>
    </>
  );
}
