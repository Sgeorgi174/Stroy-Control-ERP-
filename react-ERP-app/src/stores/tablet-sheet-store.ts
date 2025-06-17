import type { Tablet } from "@/types/tablet";
import { create } from "zustand";

type TabletSheetState = {
  isOpen: boolean;
  mode:
    | "change user"
    | "add"
    | "edit"
    | "details"
    | "change status"
    | "release"
    | null;
  selectedTablet: Tablet | null;
  openSheet: (mode: TabletSheetState["mode"], tablet?: Tablet | null) => void;
  closeSheet: () => void;
};

export const useTabletSheetStore = create<TabletSheetState>((set) => ({
  isOpen: false,
  mode: null,
  selectedTablet: null,
  openSheet: (mode, tablet = null) =>
    set({ isOpen: true, mode, selectedTablet: tablet }),
  closeSheet: () => set({ isOpen: false, mode: null, selectedTablet: null }),
}));
