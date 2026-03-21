export function SearchInput({ value, onChange, placeholder }) {
  return (
    <input
      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none sm:w-[320px]"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
