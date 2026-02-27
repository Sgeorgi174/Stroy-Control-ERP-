import { useState } from "react";
import {
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Send,
  PlayCircle,
  CheckSquare,
  Archive,
  type LucideProps,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { CommentsPopover } from "./request-comments-popover";
import { ClothesRequestDialog } from "./create-request-clothes-dialog";
import { useDeleteClothesRequest } from "@/hooks/clothes-request/useClothesRequest";
import { ChangeStatusDialog } from "./request-clothes-change-status-dialog";
import { useAuth } from "@/hooks/auth/useAuth";

import type { ClothesRequest, RequestStatus } from "@/types/clothes-request";
import { cn } from "@/lib/utils"; // Убедись, что у тебя есть утилита cn для Shadcn

type Props = {
  request: ClothesRequest;
};

// 🔹 Расширенная конфигурация действий
const STATUS_CONFIG: Record<
  RequestStatus,
  {
    label: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    className?: string;
  }
> = {
  CREATED: {
    label: "Вернуть в черновик",
    icon: Pencil,
  },
  PENDING: {
    label: "Отправить на рассмотрение",
    icon: Send,
    className: "text-blue-700 focus:text-blue-600 font-medium",
  },
  APPROVED: {
    label: "Одобрить заявку",
    icon: CheckCircle2,
    className: "text-green-600 focus:text-green-600 font-medium",
  },
  REJECTED: {
    label: "Отклонить",
    icon: XCircle,
    className: "text-orange-600 focus:text-orange-600 font-medium",
  },
  IN_PROGRESS: {
    label: "Взять в работу",
    icon: PlayCircle,
    className: "text-blue-700 focus:text-blue-600 font-medium",
  },
  COMPLETED: {
    label: "Завершить",
    icon: CheckSquare,
    className: "text-emerald-600 focus:text-emerald-600 font-medium",
  },
  CLOSED: {
    label: "Закрыть (Архив)",
    icon: Archive,
    className: "font-medium",
  },
};

const ALLOWED_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  CREATED: ["PENDING", "CLOSED"],
  PENDING: ["APPROVED", "REJECTED"],
  APPROVED: ["IN_PROGRESS", "REJECTED"],
  IN_PROGRESS: ["COMPLETED"],
  REJECTED: ["PENDING", "CLOSED"],
  COMPLETED: ["CLOSED"],
  CLOSED: [],
};

export function RequestActionsDropdown({ request }: Props) {
  const { data: user } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [statusToChange, setStatusToChange] = useState<RequestStatus | null>(
    null,
  );

  const { mutate: deleteRequest, isPending: isDeleting } =
    useDeleteClothesRequest();

  const userRole = user?.role;
  const isOwner = userRole === "OWNER";
  const isAdmin = userRole === "ADMIN";
  const isCreator = user?.id === request.createdBy.id;

  const filteredStatuses = (ALLOWED_TRANSITIONS[request.status] || []).filter(
    (nextStatus) => {
      if (isAdmin) return true;
      if (request.status === "CREATED" && !isCreator) return false;
      if ((nextStatus === "APPROVED" || nextStatus === "REJECTED") && !isOwner)
        return false;
      return true;
    },
  );

  const canEdit = request.status === "CREATED" || request.status === "REJECTED";

  const hasUnmovedItems = request.clothes?.some(
    (item) => item.quantity > item.transferredQuantity,
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" disabled={isDeleting}>
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          {filteredStatuses.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Действия со статусом
              </div>
              {filteredStatuses.map((status) => {
                const config = STATUS_CONFIG[status];
                const Icon = config.icon;

                return (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setStatusToChange(status)}
                    className={cn("cursor-pointer", config.className)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {config.label}
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
            </>
          )}

          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Управление
          </div>

          <DropdownMenuItem
            disabled={!canEdit}
            onSelect={() => setIsEditOpen(true)}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Редактировать
          </DropdownMenuItem>

          <CommentsPopover requestId={request.id} />

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            disabled={isDeleting || request.status !== "CREATED"}
            onClick={() => {
              if (
                confirm(
                  "Вы уверены, что хотите безвозвратно удалить эту заявку?",
                )
              ) {
                deleteRequest(request.id);
              }
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Удаление..." : "Удалить заявку"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ClothesRequestDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        initialData={request}
      />

      <ChangeStatusDialog
        requestId={request.id}
        newStatus={statusToChange}
        onClose={() => setStatusToChange(null)}
        hasUnmovedItems={hasUnmovedItems}
      />
    </>
  );
}
