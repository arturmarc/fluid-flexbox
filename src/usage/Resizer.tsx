import { ArrowUpIcon } from "lucide-react";

export function Resizer({ children }: { children?: JSX.Element }) {
  return (
    <div className="w-fit">
      <div className="w-96 resize overflow-hidden rounded-xl border-2 border-solid border-white p-4">
        <div className="border border-gray-700/75">{children}</div>
      </div>
      <div className="flex w-full items-center justify-end gap-1 pt-1 text-xs">
        Resize here <ArrowUpIcon className="h-4 w-4" />
      </div>
    </div>
  );
}
