import type { Object } from "@/types/object";
import { create } from "zustand";

type ObjectSheetState = {
  isOpen: boolean;
  mode: "add" | "edit" | "details" | "add employee" | "close object" | null;
  selectedObject: Object | null;
  openSheet: (mode: ObjectSheetState["mode"], object?: Object | null) => void;
  closeSheet: () => void;
};

export const useObjectSheetStore = create<ObjectSheetState>((set) => ({
  isOpen: false,
  mode: null,
  selectedObject: null,
  openSheet: (mode, object = null) =>
    set({ isOpen: true, mode, selectedObject: object }),
  closeSheet: () => set({ isOpen: false, mode: null, selectedObject: null }),
}));
