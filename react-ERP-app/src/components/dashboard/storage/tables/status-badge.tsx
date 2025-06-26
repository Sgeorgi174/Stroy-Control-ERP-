import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  Icon: React.ElementType;
  text: string;
  color: string;
  isAnimate?: boolean;
};

export function StatusBadge({
  Icon,
  text,
  color,
  isAnimate = false,
}: StatusBadgeProps) {
  return (
    <div className="rounded-xl max-w-[120px] border-2 flex items-center justify-start pl-2 gap-2">
      <Icon
        className={cn("w-[15px]", isAnimate ? "animate-spin" : "")}
        style={{ animationDuration: "3s" }}
        color={color}
      />
      <p className="text-[12px]">{text}</p>
    </div>
  );
}
