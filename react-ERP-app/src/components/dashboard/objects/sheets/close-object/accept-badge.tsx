import { CircleCheck } from "lucide-react";

export function AcceptBadge() {
  return (
    <div className="rounded-xl border-2 flex items-center gap-2 px-3">
      <CircleCheck className="w-[15px]" color="#23732E" />
      <p className="text-[12px]">Готово</p>
    </div>
  );
}
