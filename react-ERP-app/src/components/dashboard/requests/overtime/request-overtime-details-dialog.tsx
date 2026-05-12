import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadgeRequests } from "../status-badge-requests";
import type { EmployeeOvertime } from "@/types/overtime";
import {
  Calendar,
  User as UserIcon,
  MapPin,
  Wallet,
  FileText,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Check,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format-date";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/useAuth";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@/types/user";
import {
  useApproveOvertime,
  useOvertime,
  useProcessOvertime,
  useRejectOvertime,
} from "@/hooks/overtime/useOvertimes";
import { canManageOvertime } from "@/lib/utils/penalty-permissions";

type OvertimeDetailsDialogProps = {
  overtime: EmployeeOvertime | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function OvertimeDetailsDialog({
  overtime: selectedOvertime,
  open,
  onOpenChange,
}: OvertimeDetailsDialogProps) {
  const { data: user } = useAuth();
  const { data: overtime, isLoading } = useOvertime(selectedOvertime?.id);

  // Состояния для диалогов подтверждения
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { mutate: approve, isPending: isApproving } = useApproveOvertime();
  const { mutate: reject, isPending: isRejecting } = useRejectOvertime();
  const { mutate: process, isPending: isProcessing } = useProcessOvertime();

  if (!overtime && isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </DialogContent>
      </Dialog>
    );
  }

  if (!overtime) return null;

  const { canApprove, canReject, canProcess } = canManageOvertime(
    user?.role,
    overtime.status,
  );
  const isWorking = isApproving || isRejecting || isProcessing;

  // Обработчики действий
  const handleReject = () => {
    reject(
      { id: overtime.id, reason: rejectReason },
      {
        onSuccess: () => {
          setShowRejectDialog(false);
          setRejectReason("");
        },
      },
    );
  };

  const handleApprove = () => {
    approve(overtime.id, { onSuccess: () => setShowApproveDialog(false) });
  };

  const handleProcess = () => {
    process(overtime.id, { onSuccess: () => setShowProcessDialog(false) });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="min-w-[1000px] max-h-[90%] overflow-auto text-foreground">
          <DialogHeader className="flex flex-row items-center justify-between mt-8">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-2xl font-bold">
                  Переработка: {overtime.employee.firstName}{" "}
                  {overtime.employee.lastName}
                </DialogTitle>
                {isLoading && (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <div className="flex gap-4 items-center mt-2">
                <StatusBadgeRequests status={overtime.status} />
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {overtime.object.name}
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Дополнительные часы
              </p>
              <p className="text-3xl font-bold text-primary">
                +{overtime.hours} ч.
              </p>
            </div>
            <DialogDescription className="hidden" />
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            {/* Левая колонка */}
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold uppercase text-muted-foreground">
                    Участники заявки
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ParticipantItem
                    label="Создал(-а)"
                    user={overtime.creator}
                    icon={<UserIcon className="w-4 h-4 text-primary" />}
                  />
                  {overtime.approver && (
                    <ParticipantItem
                      label="Согласовал(-а)"
                      user={overtime.approver}
                      icon={<CheckCircle2 className="w-4 h-4 text-green-600" />}
                    />
                  )}
                  {overtime.accountant && (
                    <ParticipantItem
                      label="Обработал(-а)"
                      user={overtime.accountant}
                      icon={<Wallet className="w-4 h-4 text-blue-600" />}
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold uppercase text-muted-foreground">
                    Даты
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DateRow
                    label="Дата работы"
                    date={overtime.date}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <DateRow
                    label="Создано"
                    date={overtime.createdAt}
                    icon={<Clock className="w-4 h-4" />}
                  />
                  {overtime.processedAt && (
                    <DateRow
                      label="Обработано"
                      date={overtime.processedAt}
                      icon={<Check className="w-4 h-4 text-green-600" />}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Правая колонка */}
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Детали переработки
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Вид работ / Категория
                    </h4>
                    <p className="text-base font-semibold">
                      {"Сверхурочная работа"}
                    </p>
                  </div>
                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Описание
                    </h4>
                    <div className="bg-muted/50 p-4 rounded-lg border text-sm leading-relaxed min-h-[150px] whitespace-pre-wrap italic text-muted-foreground">
                      {overtime.description ||
                        "Дополнительное описание отсутствует"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t pt-6">
            <div>
              {canReject && (
                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setShowRejectDialog(true)}
                  disabled={isWorking}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Отклонить
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isWorking}
              >
                Закрыть
              </Button>

              {canApprove && (
                <Button
                  className="px-8 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setShowApproveDialog(true)}
                  disabled={isWorking}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Согласовать
                </Button>
              )}

              {canProcess && (
                <Button
                  className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowProcessDialog(true)}
                  disabled={isWorking}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Обработать часы
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалоги подтверждения */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Отклонение переработки
            </DialogTitle>
            <DialogDescription>
              Укажите причину отклонения. Эта информация будет видна сотруднику.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Введите причину отклонения..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || isRejecting}
            >
              {isRejecting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Подтвердить отклонение
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              Согласование часов
            </DialogTitle>
            <DialogDescription>
              Вы собираетесь согласовать переработку. Часы будут переданы на
              обработку.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
            >
              Отмена
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Подтвердить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-600">
              <CreditCard className="w-5 h-5" />
              Финальная обработка
            </DialogTitle>
            <DialogDescription>
              Подтвердите, что часы были учтены в табеле. Это действие закроет
              заявку.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowProcessDialog(false)}
            >
              Отмена
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleProcess}
              disabled={isProcessing}
            >
              {isProcessing && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Завершить обработку
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ParticipantItem({
  label,
  user,
  icon,
}: {
  label: string;
  user: User;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium">
          {user.lastName} {user.firstName[0]}.
        </span>
      </div>
    </div>
  );
}

function DateRow({
  label,
  date,
  icon,
}: {
  label: string;
  date: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}:
      </div>
      <span className="font-medium">{formatDate(date)}</span>
    </div>
  );
}
