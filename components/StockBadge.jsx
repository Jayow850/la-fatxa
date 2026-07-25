// Customers NEVER see stock numbers — only quiet urgency states.
// Real counts live in /admin, visible to Fatxa alone.
export default function StockBadge({ variants }) {
  const inStock = variants.filter(v => v.stock > 0);
  if (!inStock.length)
    return <div className="text-xs mt-2 italic font-serif text-[#c0b2a9]">This batch is gone</div>;
  if (inStock.some(v => v.stock <= 2))
    return (
      <div className="text-xs mt-2 text-wine font-medium flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-wine animate-pulse-dot" />
        Almost gone
      </div>
    );
  return null; // healthy stock = say nothing; scarcity only speaks when true
}
