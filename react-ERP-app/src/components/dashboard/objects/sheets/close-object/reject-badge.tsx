import { TriangleAlertIcon } from "lucide-react";

export function RejectBadge() {
  return (
    <div className="rounded-xl border-2 flex items-center gap-2 px-3">
      <TriangleAlertIcon className="w-[15px]" color="#C7BC22" />
      <p className="text-[12px]">Не готово</p>
    </div>
  );
}
