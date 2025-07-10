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
import { CheckCircle, Clock, Package, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { transferStatusMap } from "@/constants/transfer-status-map";
import { TransferConfirm } from "./tranfer-confirm";
import { TransferInTransit } from "./transfer-in-transit";
import { TransferReject } from "./transfer-reject";
import { TransferRoute } from "./transfer-route";

export function TransferSheet() {
  const { isOpen, selectedTransfer, type, closeSheet } =
    useTransferSheetStore();
  if (!selectedTransfer) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_TRANSIT":
        return "bg-blue-100 text-blue-800";
      case "CONFIRM":
        return "bg-green-100 text-green-800";
      case "REJECT":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "IN_TRANSIT":
        return <Package className="w-4 h-4" />;
      case "CONFIRM":
        return <CheckCircle className="w-4 h-4" />;
      case "REJECT":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleCancel = () => {
    console.log("cancel");
  };

  const handleRetransfer = () => {
    console.log("retrans");
  };

  const handleWriteOff = () => {
    console.log("write off");
  };

  const handleReturn = () => {
    console.log("return");
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="overflow-y-auto w-full sm:max-w-xl">
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
              handleRetransfer={handleRetransfer}
              handleReturn={handleReturn}
              handleWriteOff={handleWriteOff}
            />
          )}

          {selectedTransfer.status === "IN_TRANSIT" && (
            <TransferInTransit handleCancel={handleCancel} />
          )}

          {selectedTransfer.status === "CONFIRM" && (
            <TransferConfirm selectedTransfer={selectedTransfer} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
