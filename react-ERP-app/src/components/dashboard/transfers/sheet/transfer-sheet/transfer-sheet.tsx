import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTransferSheetStore } from "@/stores/transfer-sheet-store";
import { ToolTransferDetails } from "../tool-transfer-details";
import { DeviceTransferDetails } from "../device-transfer-details";
import { ClothesTransferDetails } from "../clothes-transfer-details";
import type {
  PendingClothesTransfer,
  PendingDeviceTransfer,
  PendingToolTransfer,
} from "@/types/transfers";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { transferStatusMap } from "@/constants/transfer-status-map";
import { TransferConfirm } from "./tranfer-confirm";
import { TransferInTransit } from "./transfer-in-transit";
import { TransferReject } from "./transfer-reject";
import { TransferRoute } from "./transfer-route";
import { useState } from "react";
import ResendTransferDialog from "../../dialogs/resend-transfer-dialog";
import WriteOffTransferDialog from "../../dialogs/write-off-transfer-dialog";
import ReturnToSenderDialog from "../../dialogs/return-to-sender-dialog";
import CancelTransferDialog from "../../dialogs/cancel-transfer-dialog";
import { useCancelToolTransfer } from "@/hooks/tool/useCancelToolTransfer";
import toast from "react-hot-toast";
import { TransferCancel } from "./transfer-cancel";
import { useResendToolTransfer } from "@/hooks/tool/useResendToolTransfer";
import {
  getStatusColor,
  getStatusIcon,
} from "@/lib/utils/IconAndColorTransferBadge";
import { useWriteOffToolInTransfer } from "@/hooks/tool/useWriteOffToolInTransfer";
import { useReturnToolToSource } from "@/hooks/tool/useReturnToolToSource";
import { getColorStatus } from "@/lib/utils/getColorStatus";
import { rejectModeMap } from "@/constants/rejectModeMap";
import { useCancelDeviceTransfer } from "@/hooks/device/useCancelDeviceTransfer";
import { useResendDeviceTransfer } from "@/hooks/device/useResendDeviceTransfer";
import { useWriteOffDeviceInTransfer } from "@/hooks/device/useWriteOffDeviceInTransfer";
import { useReturnDeviceToSource } from "@/hooks/device/useReturnDeviceToSource";
import {
  useCancelClothesTransfer,
  useResendClothesTransfer,
  useReturnClothesToSource,
  useWriteOffClothesInTransfer,
} from "@/hooks/clothes/useClothes";

export function TransferSheet() {
  const { isOpen, selectedTransfer, type, closeSheet } =
    useTransferSheetStore();
  {
    /* TOOL HOOKS*/
  }
  const cancelToolTransferMutation = useCancelToolTransfer(
    selectedTransfer ? selectedTransfer.id : ""
  );
  const resendToolTransferMutation = useResendToolTransfer(
    selectedTransfer ? selectedTransfer.id : ""
  );
  const writeOffToolTransferMutation = useWriteOffToolInTransfer(
    selectedTransfer ? selectedTransfer.id : ""
  );
  const returnToolTransferMutation = useReturnToolToSource();
  {
    /* DIVICE HOOKS*/
  }
  const cancelDeviceTransferMutation = useCancelDeviceTransfer(
    selectedTransfer ? selectedTransfer.id : ""
  );
  const resendDeviceTransferMutation = useResendDeviceTransfer(
    selectedTransfer ? selectedTransfer.id : ""
  );
  const writeOffDeviceTransferMutation = useWriteOffDeviceInTransfer(
    selectedTransfer ? selectedTransfer.id : ""
  );
  const returnDeviceTransferMutation = useReturnDeviceToSource();
  {
    /* DIVICE HOOKS*/
  }
  const cancelClothesTransferMutation = useCancelClothesTransfer(
    selectedTransfer ? selectedTransfer.id : ""
  );
  const resendClothesTransferMutation = useResendClothesTransfer(
    selectedTransfer ? selectedTransfer.id : ""
  );
  const writeOffClothesTransferMutation = useWriteOffClothesInTransfer(
    selectedTransfer ? selectedTransfer.id : ""
  );
  const returnClothesTransferMutation = useReturnClothesToSource();

  const [isResendDialogOpen, setIsResendDialogOpen] = useState(false);
  const [isWriteOffDialogOpen, setIsWriteOffDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const [selectedObjectId, setSelectedObjectId] = useState("");

  const [comment, setComment] = useState("");

  if (!selectedTransfer) return null;

  const handleCancel = () => {
    if (type === "tool") {
      cancelToolTransferMutation.mutate(
        { rejectionComment: comment },
        {
          onSuccess: () => {
            setIsCancelDialogOpen(false);
            closeSheet();
          },
        }
      );
    }

    if (type === "device") {
      cancelDeviceTransferMutation.mutate(
        { rejectionComment: comment },
        {
          onSuccess: () => {
            setIsCancelDialogOpen(false);
            closeSheet();
          },
        }
      );
    }

    if (type === "clothes") {
      cancelClothesTransferMutation.mutate(
        { rejectionComment: comment },
        {
          onSuccess: () => {
            setIsCancelDialogOpen(false);
            closeSheet();
          },
        }
      );
    }

    setComment("");
  };

  const handleResend = () => {
    if (!selectedObjectId) {
      toast.error("Выберите объект для перемещения");
      return;
    }
    if (type === "tool") {
      resendToolTransferMutation.mutate(
        { toObjectId: selectedObjectId }, // <-- правильно
        {
          onSuccess: () => {
            setIsResendDialogOpen(false);
            closeSheet();
          },
        }
      );
    }

    if (type === "device") {
      resendDeviceTransferMutation.mutate(
        { toObjectId: selectedObjectId }, // <-- правильно
        {
          onSuccess: () => {
            setIsResendDialogOpen(false);
            closeSheet();
          },
        }
      );
    }

    if (type === "clothes") {
      resendClothesTransferMutation.mutate(
        { toObjectId: selectedObjectId }, // <-- правильно
        {
          onSuccess: () => {
            setIsResendDialogOpen(false);
            closeSheet();
          },
        }
      );
    }

    setSelectedObjectId("");
  };

  const handleWriteOff = () => {
    if (type === "tool") {
      writeOffToolTransferMutation.mutate(
        { status: "WRITTEN_OFF", comment: comment },
        {
          onSuccess: () => {
            setIsWriteOffDialogOpen(false);
            closeSheet();
          },
        }
      );
    }

    if (type === "device") {
      writeOffDeviceTransferMutation.mutate(
        { status: "WRITTEN_OFF", comment: comment },
        {
          onSuccess: () => {
            setIsWriteOffDialogOpen(false);
            closeSheet();
          },
        }
      );
    }

    if (type === "clothes") {
      writeOffClothesTransferMutation.mutate(
        { comment: comment },
        {
          onSuccess: () => {
            setIsWriteOffDialogOpen(false);
            closeSheet();
          },
        }
      );
    }

    setComment("");
  };

  const handleReturn = () => {
    if (type === "tool") {
      returnToolTransferMutation.mutate(selectedTransfer.id, {
        onSuccess: () => {
          setIsReturnDialogOpen(false);
          closeSheet();
          toast.success("Инструмент возвращен отправителю");
        },
      });
    }

    if (type === "device") {
      returnDeviceTransferMutation.mutate(selectedTransfer.id, {
        onSuccess: () => {
          setIsReturnDialogOpen(false);
          closeSheet();
          toast.success("Инструмент возвращен отправителю");
        },
      });
    }

    if (type === "clothes") {
      returnClothesTransferMutation.mutate(selectedTransfer.id, {
        onSuccess: () => {
          setIsReturnDialogOpen(false);
          closeSheet();
          toast.success("Инструмент возвращен отправителю");
        },
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="w-[700px] sm:max-w-[1000px] overflow-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <SheetTitle className="text-xl">Детали перемещения</SheetTitle>
              <SheetDescription>
                ID перемещения: {selectedTransfer.id}
              </SheetDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              className={`${getStatusColor(
                selectedTransfer.status
              )} flex items-center gap-1`}
            >
              {getStatusIcon(selectedTransfer.status)}
              {transferStatusMap[selectedTransfer.status]}
            </Badge>
            {selectedTransfer.rejectMode && (
              <Badge
                className={`col-span-2 text-xs bg-transparent text-primary ${getColorStatus(
                  selectedTransfer.status
                )} rounded-xl font-medium text-center`}
              >
                {rejectModeMap[selectedTransfer.rejectMode]}
              </Badge>
            )}
          </div>
        </SheetHeader>
        <div className="space-y-6 mt-3 px-3">
          {type === "tool" && (
            <ToolTransferDetails
              toolTransfer={selectedTransfer as PendingToolTransfer}
            />
          )}
          {type === "device" && (
            <DeviceTransferDetails
              deviceTransfer={selectedTransfer as PendingDeviceTransfer}
            />
          )}
          {type === "clothes" && (
            <ClothesTransferDetails
              clothesTransfer={selectedTransfer as PendingClothesTransfer}
            />
          )}
          <TransferRoute selectedTransfer={selectedTransfer} />

          {selectedTransfer.status === "REJECT" && (
            <TransferReject
              selectedTransfer={selectedTransfer}
              handleRetransfer={() => setIsResendDialogOpen(true)}
              handleReturn={() => setIsReturnDialogOpen(true)}
              handleWriteOff={() => setIsWriteOffDialogOpen(true)}
            />
          )}

          {selectedTransfer.status === "IN_TRANSIT" && (
            <TransferInTransit
              handleCancel={() => setIsCancelDialogOpen(true)}
              selectedTransfer={selectedTransfer}
            />
          )}

          {selectedTransfer.status === "CANCEL" && (
            <TransferCancel selectedTransfer={selectedTransfer} />
          )}

          {selectedTransfer.status === "CONFIRM" && (
            <TransferConfirm selectedTransfer={selectedTransfer} />
          )}
        </div>
      </SheetContent>

      {selectedTransfer.status === "REJECT" && (
        <div>
          <ResendTransferDialog
            setSelectedObjectId={setSelectedObjectId}
            selectedObjectId={selectedObjectId}
            handleResend={handleResend}
            isOpen={isResendDialogOpen}
            onOpenChange={setIsResendDialogOpen}
            selectedTransfer={selectedTransfer}
            type={type}
          />
          <WriteOffTransferDialog
            comment={comment}
            selectedTransfer={selectedTransfer}
            setComment={setComment}
            type={type}
            isOpen={isWriteOffDialogOpen}
            onOpenChange={setIsWriteOffDialogOpen}
            handleWriteOff={handleWriteOff}
          />
          <ReturnToSenderDialog
            handleReturn={handleReturn}
            isOpen={isReturnDialogOpen}
            selectedTransfer={selectedTransfer}
            onOpenChange={setIsReturnDialogOpen}
            type={type}
          />
        </div>
      )}

      {selectedTransfer.status === "IN_TRANSIT" &&
        selectedTransfer.rejectMode !== "RETURN_TO_SOURCE" && (
          <CancelTransferDialog
            comment={comment}
            setComment={setComment}
            handleCancel={handleCancel}
            isOpen={isCancelDialogOpen}
            onOpenChange={setIsCancelDialogOpen}
            selectedTransfer={selectedTransfer}
            type={type}
          />
        )}
    </Sheet>
  );
}
