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
import { Ban, Edit2, MoreHorizontal, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EmployeeOvertime } from "@/types/overtime";
import { useCancelOvertime } from "@/hooks/overtime/useOvertimes";
import { OvertimeDetailsDialog } from "./request-overtime-details-dialog";
import { OvertimeCommentsWindow } from "./request-overtime-comments-window";
import { OvertimeCreateDialog } from "./create-request-overtime-dialog";

type Props = {
  data: EmployeeOvertime[];
  isLoading: boolean;
};

export function OvertimeRequestsTable({ data, isLoading }: Props) {
  const [selectedOvertime, setSelectedOvertime] =
    useState<EmployeeOvertime | null>(null);
  const [editingOvertime, setEditingOvertime] =
    useState<EmployeeOvertime | null>(null);

  const [overtimeIdToCancel, setOvertimeIdToCancel] = useState<string | null>(
    null,
  );

  const { mutate: cancelOvertime, isPending: isCancelling } =
    useCancelOvertime();

  const handleConfirmCancel = () => {
    if (overtimeIdToCancel) {
      cancelOvertime(overtimeIdToCancel, {
        onSettled: () => setOvertimeIdToCancel(null),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">
          Загрузка часов...
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-2">Доп. часы не найдены</p>
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
              <TableHead>Описание</TableHead>
              <TableHead className="text-right">Часы</TableHead>
              <TableHead className="text-center">Статус</TableHead>
              <TableHead className="w-[100px] text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((overtime) => {
              const canEdit = ["PENDING", "REJECTED"].includes(overtime.status);
              const canCancel = !["PROCESSED", "CANCELED"].includes(
                overtime.status,
              );

              return (
                <TableRow
                  key={overtime.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedOvertime(overtime)}
                >
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(overtime.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {overtime.employee.lastName} {overtime.employee.firstName}{" "}
                    {overtime.employee.fatherName}
                  </TableCell>
                  <TableCell className="text-sm">
                    {overtime.object.name}
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate text-muted-foreground">
                    {overtime.description || "—"}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    <div className="flex items-center justify-end gap-1">
                      {overtime.hours}{" "}
                      <Clock className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadgeRequests status={overtime.status} />
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <OvertimeCommentsWindow
                        employeeName={`${overtime.employee.lastName} ${overtime.employee.firstName.charAt(0)}.`}
                        overtimeId={overtime.id}
                      />

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem
                            onClick={() => setSelectedOvertime(overtime)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Просмотр
                          </DropdownMenuItem>

                          {canEdit && (
                            <DropdownMenuItem
                              onClick={() => setEditingOvertime(overtime)}
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
                                  setOvertimeIdToCancel(overtime.id)
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

      <AlertDialog
        open={!!overtimeIdToCancel}
        onOpenChange={(open) => !open && setOvertimeIdToCancel(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отменить доп. часы?</AlertDialogTitle>
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

      <OvertimeDetailsDialog
        overtime={selectedOvertime}
        open={!!selectedOvertime}
        onOpenChange={(open) => !open && setSelectedOvertime(null)}
      />

      <OvertimeCreateDialog
        open={!!editingOvertime}
        onOpenChange={(open) => !open && setEditingOvertime(null)}
        initialData={editingOvertime}
      />
    </>
  );
}
