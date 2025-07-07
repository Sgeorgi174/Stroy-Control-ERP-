import { create } from "zustand";
import type {
  PendingClothesTransfer,
  PendingDeviceTransfer,
  PendingToolTransfer,
} from "@/types/transfers";

type TransfersSheetState = {
  isOpen: boolean;
  type: "tool" | "clothes" | "device" | null;
  selectedTransfer:
    | PendingToolTransfer
    | PendingClothesTransfer
    | PendingDeviceTransfer
    | null;
  openSheet: (
    mode: TransfersSheetState["type"],
    transfer?:
      | PendingToolTransfer
      | PendingClothesTransfer
      | PendingDeviceTransfer
      | null
  ) => void;
  closeSheet: () => void;
};

export const useTransferSheetStore = create<TransfersSheetState>((set) => ({
  isOpen: false,
  type: null,
  selectedTransfer: null,
  openSheet: (type, transfer = null) =>
    set({ isOpen: true, type: type, selectedTransfer: transfer }),
  closeSheet: () => set({ isOpen: false, type: null, selectedTransfer: null }),
}));
