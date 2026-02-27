import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { RequestStatus } from "@/types/clothes-request";
import { useUpdateClothesRequestStatus } from "@/hooks/clothes-request/useClothesRequest";
import { cn } from "@/lib/utils";

type Props = {
  requestId: string;
  newStatus: RequestStatus | null;
  onClose: () => void;
  hasUnmovedItems?: boolean; // Новый проп
};

// 🔹 Словарь для человекочитаемых текстов
const STATUS_MESSAGES: Record<
  RequestStatus,
  { title: string; question: string; button: string }
> = {
  CREATED: {
    title: "Возврат в черновик",
    question: "Вы уверены, что хотите вернуть заявку в статус черновика?",
    button: "Вернуть",
  },
  PENDING: {
    title: "Отправка на рассмотрение",
    question: "Вы уверены, что хотите отправить заявку на рассмотрение?",
    button: "Отправить",
  },
  APPROVED: {
    title: "Одобрение заявки",
    question: "Вы подтверждаете одобрение данной заявки?",
    button: "Одобрить",
  },
  REJECTED: {
    title: "Отклонение заявки",
    question: "Вы действительно хотите отклонить эту заявку?",
    button: "Отклонить",
  },
  IN_PROGRESS: {
    title: "Принятие в работу",
    question:
      "Вы подтверждаете, что заявка принята в работу и начинает выполняться?",
    button: "В работу",
  },
  COMPLETED: {
    title: "Завершение работы",
    question: "Вы уверены, что все работы по заявке выполнены?",
    button: "Завершить",
  },
  CLOSED: {
    title: "Архивация заявки",
    question: "Вы уверены, что хотите закрыть и заархивировать заявку?",
    button: "Закрыть",
  },
};

const TEMPLATE_PHRASE = "Причина закрытия с нераспределенными позициями: ";

export function ChangeStatusDialog({
  requestId,
  newStatus,
  onClose,
  hasUnmovedItems,
}: Props) {
  const [text, setText] = useState("");
  const { mutate: updateStatus, isPending } =
    useUpdateClothesRequestStatus(requestId);

  const isRequiredByUnmoved = newStatus === "CLOSED" && hasUnmovedItems;
  const isRejected = newStatus === "REJECTED";
  const isCommentRequired = isRejected || isRequiredByUnmoved;

  useEffect(() => {
    if (isRequiredByUnmoved && !text.startsWith(TEMPLATE_PHRASE)) {
      setText(TEMPLATE_PHRASE);
    }
  }, [isRequiredByUnmoved]);

  if (!newStatus) return null;

  const config = STATUS_MESSAGES[newStatus];

  const handleConfirm = () => {
    updateStatus(
      { status: newStatus, text },
      {
        onSuccess: () => {
          onClose();
          setText("");
        },
      },
    );
  };

  return (
    <Dialog open={!!newStatus} onOpenChange={onClose}>
      <DialogContent className="w-[600px]">
        <DialogHeader>
          <DialogTitle>{config?.title || "Смена статуса"}</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            {config?.question || `Вы уверены?`}
          </p>

          {/* Показываем поле, если это отказ ИЛИ наше новое условие по остаткам */}
          {(isRejected || isRequiredByUnmoved) && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
              <Label
                htmlFor="status-comment"
                className="text-xs uppercase tracking-wider font-semibold text-red-600 flex items-center gap-2"
              >
                {isRequiredByUnmoved
                  ? "Внимание: на заявке есть неперемещенные позиции"
                  : "Причина отказа"}{" "}
                (обязательно)
              </Label>
              <Textarea
                id="status-comment"
                placeholder="Опишите причину..."
                value={text}
                onChange={(e) => {
                  const val = e.target.value;
                  // Не даем удалить шаблонную фразу, если она обязательна
                  if (isRequiredByUnmoved && !val.startsWith(TEMPLATE_PHRASE)) {
                    return;
                  }
                  setText(val);
                }}
                className={cn(
                  "resize-none mt-5",
                  isRequiredByUnmoved &&
                    "border-orange-300 focus-visible:ring-orange-400",
                )}
                rows={4}
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Отмена
          </Button>
          <Button
            variant={isRejected ? "destructive" : "default"}
            onClick={handleConfirm}
            // Кнопка заблокирована, если комментарий обязателен, а текста (кроме шаблона) нет
            disabled={
              isPending ||
              (isCommentRequired && text.trim() === "") ||
              (isRequiredByUnmoved && text.trim() === TEMPLATE_PHRASE.trim())
            }
          >
            {isPending ? "Сохранение..." : config?.button || "Подтвердить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
