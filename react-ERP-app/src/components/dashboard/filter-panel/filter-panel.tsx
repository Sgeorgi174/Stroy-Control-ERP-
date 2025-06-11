type FilterPanelProps = {
  children: React.ReactNode;
};

export function FilterPanel({ children }: FilterPanelProps) {
  return (
    <div className="flex items-center flex-wrap justify-between gap-6 mt-6">
      {children}
    </div>
  );
}
