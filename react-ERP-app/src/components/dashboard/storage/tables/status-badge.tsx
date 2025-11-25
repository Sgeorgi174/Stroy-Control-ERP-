import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  Icon: React.ElementType;
  text: string;
  isAnimate?: boolean;
};

export function StatusBadge({
  Icon,
  text,
  isAnimate = false,
}: StatusBadgeProps) {
  return (
    <div className="rounded-xl max-w-[120px] flex items-center justify-center gap-2">
      <p className="text-[14px] font-medium">{text}</p>
      <Icon
        className={cn("w-[18px]", isAnimate ? "animate-spin" : "")}
        style={{ animationDuration: "3s" }}
      />
    </div>
  );
}
