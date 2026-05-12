import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatusBadgeRequests } from "../status-badge-requests";
import type { EmployeePenalty } from "@/types/penalty";
import { PenaltyDetailsDialog } from "./request-penalty-details-dialog";
import { PenaltyCreateDialog } from "./create-request-employee-dialog";
import { Ban, Edit2, MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCancelPenalty } from "@/hooks/penalties/usePenalties";
import { PenaltyCommentsWindow } from "./request-penalty-comments-popover";

type Props = {
  data: EmployeePenalty[];
  isLoading: boolean;
};

export function EmployeeRequestsTable({ data, isLoading }: Props) {
  const [selectedPenalty, setSelectedPenalty] =
    useState<EmployeePenalty | null>(null);
  const [editingPenalty, setEditingPenalty] = useState<EmployeePenalty | null>(
    null,
  );

  // Состояние для ID штрафа, который хотим отменить
  const [penaltyIdToCancel, setPenaltyIdToCancel] = useState<string | null>(
    null,
  );

  const { mutate: cancelPenalty, isPending: isCancelling } = useCancelPenalty();

  const handleConfirmCancel = () => {
    if (penaltyIdToCancel) {
      cancelPenalty(penaltyIdToCancel, {
        onSettled: () => setPenaltyIdToCancel(null),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">
          Загрузка штрафов...
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-2">Штрафы не найдены</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Дата</TableHead>
              <TableHead>Сотрудник</TableHead>
              <TableHead>Объект</TableHead>
              <TableHead>Причина</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
              <TableHead className="text-center">Статус</TableHead>
              <TableHead className="w-[100px] text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((penalty) => {
              const canEdit = ["PENDING", "REJECTED"].includes(penalty.status);
              const canCancel = !["PROCESSED", "CANCELLED"].includes(
                penalty.status,
              );

              return (
                <TableRow
                  key={penalty.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedPenalty(penalty)}
                >
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(penalty.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {penalty.employee.lastName} {penalty.employee.firstName}{" "}
                    {penalty.employee.fatherName}
                  </TableCell>
                  <TableCell className="text-sm">
                    {penalty.object.name}
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate text-muted-foreground">
                    {penalty.reason}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {penalty.amount.toLocaleString()} ₽
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadgeRequests status={penalty.status} />
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <PenaltyCommentsWindow
                        penaltyName={`${penalty.employee.lastName} ${penalty.employee.firstName.charAt(0)}.${penalty.employee.fatherName.charAt(0)}.`}
                        penaltyId={penalty.id}
                      />

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem
                            onClick={() => setSelectedPenalty(penalty)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Просмотр
                          </DropdownMenuItem>

                          {canEdit && (
                            <DropdownMenuItem
                              onClick={() => setEditingPenalty(penalty)}
                            >
                              <Edit2 className="mr-2 h-4 w-4" />
                              Изменить
                            </DropdownMenuItem>
                          )}

                          {canCancel && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onSelect={() =>
                                  setPenaltyIdToCancel(penalty.id)
                                }
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Отменить
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Диалог подтверждения отмены */}
      <AlertDialog
        open={!!penaltyIdToCancel}
        onOpenChange={(open) => !open && setPenaltyIdToCancel(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отменить заявку на штраф?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы действительно хотите отменить эту заявку?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Назад</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmCancel();
              }}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? "Отмена..." : "Да, отменить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PenaltyDetailsDialog
        penalty={selectedPenalty}
        open={!!selectedPenalty}
        onOpenChange={(open) => !open && setSelectedPenalty(null)}
      />

      <PenaltyCreateDialog
        open={!!editingPenalty}
        onOpenChange={(open) => !open && setEditingPenalty(null)}
        initialData={editingPenalty}
      />
    </>
  );
}
