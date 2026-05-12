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
import type { EmployeePenalty } from "@/types/penalty";
import {
  usePenalty,
  useApprovePenalty,
  useRejectPenalty,
  useProcessPenalty,
} from "@/hooks/penalties/usePenalties";
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
import { canManagePenalty } from "@/lib/utils/penalty-permissions";
import { useAuth } from "@/hooks/auth/useAuth";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@/types/user";

type PenaltyDetailsDialogProps = {
  penalty: EmployeePenalty | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PenaltyDetailsDialog({
  penalty: selectedPenalty,
  open,
  onOpenChange,
}: PenaltyDetailsDialogProps) {
  const { data: user } = useAuth();
  const { data: penalty, isLoading } = usePenalty(selectedPenalty?.id);

  // Состояния для диалогов подтверждения
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { mutate: approve, isPending: isApproving } = useApprovePenalty();
  const { mutate: reject, isPending: isRejecting } = useRejectPenalty();
  const { mutate: process, isPending: isProcessing } = useProcessPenalty();

  if (!penalty && isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </DialogContent>
      </Dialog>
    );
  }

  if (!penalty) return null;

  const { canApprove, canReject, canProcess } = canManagePenalty(
    user?.role,
    penalty.status,
  );
  const isWorking = isApproving || isRejecting || isProcessing;

  // Обработчики действий
  const handleReject = () => {
    reject(
      { id: penalty.id, reason: rejectReason },
      {
        onSuccess: () => {
          setShowRejectDialog(false);
          setRejectReason("");
        },
      },
    );
  };

  const handleApprove = () => {
    approve(penalty.id, { onSuccess: () => setShowApproveDialog(false) });
  };

  const handleProcess = () => {
    process(penalty.id, { onSuccess: () => setShowProcessDialog(false) });
  };

  return (
    <>
      {/* Основной диалог деталей */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="min-w-[1000px] max-h-[90%] overflow-auto text-foreground">
          <DialogHeader className="flex flex-row items-center justify-between mt-8">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-2xl font-bold">
                  Штраф: {penalty.employee.firstName}{" "}
                  {penalty.employee.lastName}
                </DialogTitle>
                {isLoading && (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <div className="flex gap-4 items-center mt-2">
                <StatusBadgeRequests status={penalty.status} />
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {penalty.object.name}
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Сумма штрафа
              </p>
              <p className="text-2xl font-bold text-destructive">
                -{penalty.amount.toLocaleString()} ₽
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
                    user={penalty.creator}
                    icon={<UserIcon className="w-4 h-4 text-primary" />}
                  />
                  {penalty.approver && (
                    <ParticipantItem
                      label="Согласовал(-а)"
                      user={penalty.approver}
                      icon={<CheckCircle2 className="w-4 h-4 text-green-600" />}
                    />
                  )}
                  {penalty.accountant && (
                    <ParticipantItem
                      label="Обработал(-а)"
                      user={penalty.accountant}
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
                    label="Дата нарушения"
                    date={penalty.date}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <DateRow
                    label="Создано"
                    date={penalty.createdAt}
                    icon={<Clock className="w-4 h-4" />}
                  />
                  {penalty.processedAt && (
                    <DateRow
                      label="Обработано"
                      date={penalty.processedAt}
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
                    Детали нарушения
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Причина / Категория
                    </h4>
                    <p className="text-base font-semibold">{penalty.reason}</p>
                  </div>
                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Подробное описание
                    </h4>
                    <div className="bg-muted/50 p-4 rounded-lg border text-sm leading-relaxed min-h-[150px] whitespace-pre-wrap italic text-muted-foreground">
                      {penalty.description ||
                        "Дополнительное описание отсутствует"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Футер */}
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
                  Обработать заявку
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- ДИАЛОГИ ПОДТВЕРЖДЕНИЯ --- */}

      {/* Диалог отклонения */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Отклонение штрафа
            </DialogTitle>
            <DialogDescription>
              Укажите причину отклонения. Эта информация будет видна создателю
              заявки.
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

      {/* Диалог согласования */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              Подтверждение согласования
            </DialogTitle>
            <DialogDescription>
              Вы собираетесь согласовать данный штраф. Заявка перейдет на этап
              обработки бухгалтерией.
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

      {/* Диалог обработки */}
      <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-600">
              <CreditCard className="w-5 h-5" />
              Финальная обработка
            </DialogTitle>
            <DialogDescription>
              Подтвердите, что штраф был учтен. Это действие закроет заявку.
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

// ... ParticipantItem и DateRow без изменений

// Маленькие под-компоненты для чистоты кода
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
