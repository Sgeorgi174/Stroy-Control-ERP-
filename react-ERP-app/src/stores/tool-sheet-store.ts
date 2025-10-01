import { create } from "zustand";
import type { Tool } from "@/types/tool";

type ToolsSheetState = {
  isOpen: boolean;
  mode:
    | "transfer"
    | "add"
    | "edit"
    | "details"
    | "change status"
    | "edit bag"
    | null;
  selectedTool: Tool | null;
  openSheet: (mode: ToolsSheetState["mode"], tool?: Tool | null) => void;
  closeSheet: () => void;
};

export const useToolsSheetStore = create<ToolsSheetState>((set) => ({
  isOpen: false,
  mode: null,
  selectedTool: null,
  openSheet: (mode, tool = null) =>
    set({ isOpen: true, mode, selectedTool: tool }),
  closeSheet: () => set({ isOpen: false, mode: null, selectedTool: null }),
}));
