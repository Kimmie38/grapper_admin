export function ErrorPanel({ title, message, action }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-sm">{message}</div>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
