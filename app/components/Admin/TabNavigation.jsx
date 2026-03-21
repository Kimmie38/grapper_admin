export function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const isActive = activeTab === t.key;
        const activeClass = isActive
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-700";
        const borderClass = isActive ? "border-gray-900" : "border-gray-200";
        const className = `rounded-lg border ${borderClass} px-3 py-2 text-sm font-semibold hover:bg-gray-50 ${activeClass}`;

        return (
          <button
            key={t.key}
            className={className}
            onClick={() => onTabChange(t.key)}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
