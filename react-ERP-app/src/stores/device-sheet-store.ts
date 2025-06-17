import type { Device } from "@/types/device";
import { create } from "zustand";

type DeviceSheetState = {
  isOpen: boolean;
  mode: "transfer" | "add" | "edit" | "details" | "change status" | null;
  selectedDevice: Device | null;
  openSheet: (mode: DeviceSheetState["mode"], device?: Device | null) => void;
  closeSheet: () => void;
};

export const useDeviceSheetStore = create<DeviceSheetState>((set) => ({
  isOpen: false,
  mode: null,
  selectedDevice: null,
  openSheet: (mode, device = null) =>
    set({ isOpen: true, mode, selectedDevice: device }),
  closeSheet: () => set({ isOpen: false, mode: null, selectedDevice: null }),
}));
