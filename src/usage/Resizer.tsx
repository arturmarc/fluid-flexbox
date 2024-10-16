export function Resizer({ children }: { children?: JSX.Element }) {
  return (
    <div className="w-96 resize overflow-hidden rounded-xl border-2 border-solid border-white p-4">
      <div className="border border-gray-700/75">{children}</div>
    </div>
  );
}
