type TransfersWrapperProps = {
  children: React.ReactNode;
};

export function TransfersWrapper({ children }: TransfersWrapperProps) {
  return <div className="space-y-3 mt-6">{children}</div>;
}
