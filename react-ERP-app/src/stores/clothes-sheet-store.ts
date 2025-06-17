import { create } from "zustand";
import type { Clothes } from "@/types/clothes";

type ClothesSheetState = {
  isOpen: boolean;
  mode:
    | "transfer"
    | "add"
    | "edit"
    | "details"
    | "create"
    | "written_off"
    | "give"
    | null;
  selectedClothes: Clothes | null;
  openSheet: (
    mode: ClothesSheetState["mode"],
    clothes?: Clothes | null
  ) => void;
  closeSheet: () => void;
};

export const useClothesSheetStore = create<ClothesSheetState>((set) => ({
  isOpen: false,
  mode: null,
  selectedClothes: null,
  openSheet: (mode, clothes = null) =>
    set({ isOpen: true, mode, selectedClothes: clothes }),
  closeSheet: () => set({ isOpen: false, mode: null, selectedClothes: null }),
}));
