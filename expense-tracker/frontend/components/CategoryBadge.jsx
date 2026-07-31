export default function CategoryBadge({ category, colors }) {
  const color = colors?.[category] || "#9ca3af";

  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `${color}18`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      {category || "Other"}
    </span>
  );
}
