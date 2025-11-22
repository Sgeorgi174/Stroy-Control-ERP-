import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useState } from "react";
import type { PendingToolTransfer } from "@/types/transfers";
import { Package } from "lucide-react";
import { ToolInfo } from "./tool-notifation-info";
import { ToolRejectSection } from "./tool-notification-reject";
import { ConfirmCheckbox } from "../notification-confirm-checkbox";
import { useConfirmToolTransfer } from "@/hooks/tool/useConfirmToolTransfer";
import { useRejectToolTransfer } from "@/hooks/tool/useRejectToolTransfer"; // импорт хука отказа
import { useConfirmToolBulkTransfer } from "@/hooks/tool/useConfirmToolTransferBulk";

type ToolTransferDialogProps = {
  toolTransfer: PendingToolTransfer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ToolTransferDialog({
  toolTransfer,
  onOpenChange,
}: ToolTransferDialogProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const hasPhoto = Boolean(toolTransfer.photoUrl);

  const confirmTransferMutation = useConfirmToolTransfer();
  const confirmTransferBulkMutation = useConfirmToolBulkTransfer();
  const rejectTransferMutation = useRejectToolTransfer(toolTransfer.id);

  // Подтверждение перемещения
  const handleConfirm = () => {
    if (!isConfirmed) return;
    if (toolTransfer.tool.isBulk) {
      confirmTransferBulkMutation.mutate(toolTransfer.id, {
        onSuccess: () => {
          setIsConfirmed(false);
          onOpenChange(false);
        },
      });

      return true;
    }
    confirmTransferMutation.mutate(toolTransfer.id, {
      onSuccess: () => {
        setIsConfirmed(false);
        onOpenChange(false);
      },
    });
  };

  // Отказ от перемещения
  const handleReject = () => {
    if (!rejectComment || !toolTransfer.photoUrl) return;
    rejectTransferMutation.mutate(
      { rejectionComment: rejectComment },
      {
        onSuccess: () => {
          setRejectComment("");
          setIsReject(false);
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <DialogContent className="max-w-3xl min-w-[700px] max-h-[80vh] overflow-auto flex flex-col">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-violet-500" />
          Подтверждение перемещения
        </DialogTitle>
        <DialogDescription>
          Пожалуйста, ознакомьтесь с деталями перемещения и подтвердите
          получение инструмента.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-5 py-4">
        <div className="space-y-3 font-medium">Инструмент:</div>
        <ToolInfo transfer={toolTransfer} />
      </div>

      {isReject && <Separator className="my-2" />}
      {isReject && (
        <ToolRejectSection
          toolTransfer={toolTransfer}
          comment={rejectComment}
          setComment={setRejectComment}
        />
      )}

      <div className="border-t pt-4">
        {!isReject && (
          <ConfirmCheckbox checked={isConfirmed} onChange={setIsConfirmed} />
        )}

        <DialogFooter>
          <div className="flex gap-5">
            {isReject && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsReject(false);
                    setRejectComment("");
                  }}
                >
                  Отмена
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={
                    !rejectComment.trim() ||
                    !hasPhoto ||
                    rejectTransferMutation.isPending
                  }
                >
                  Подтвердить отказ
                </Button>
              </>
            )}
            {!isReject && (
              <>
                <Button variant="destructive" onClick={() => setIsReject(true)}>
                  Отказаться
                </Button>
                <Button
                  disabled={!isConfirmed || confirmTransferMutation.isPending}
                  onClick={handleConfirm}
                >
                  Принять
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </div>
    </DialogContent>
  );
}
