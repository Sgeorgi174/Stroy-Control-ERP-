import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/types/clothes-request";

type Props = {
  status: RequestStatus;
};

const statusConfig: Record<
  RequestStatus,
  { bg: string; text: string; label: string }
> = {
  CREATED: {
    bg: "bg-blue-50",
    text: "text-gray-700",
    label: "Создана",
  },
  PENDING: {
    bg: "bg-blue-50",
    text: "text-gray-700",
    label: "На рассмотрении",
  },
  APPROVED: {
    bg: "bg-green-50",
    text: "text-green-700",
    label: "Одобрено",
  },
  REJECTED: {
    bg: "bg-red-50",
    text: "text-red-700",
    label: "Отклонено",
  },
  IN_PROGRESS: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    label: "В процессе",
  },
  COMPLETED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    label: "Завершено",
  },
  CLOSED: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    label: "Закрыто",
  },
};

export function StatusBadgeRequests({ status }: Props) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        config.bg,
        config.text,
      )}
    >
      {config.label}
    </span>
  );
}
