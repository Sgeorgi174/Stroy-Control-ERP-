import type { Employee } from "@/types/employee";
import { create } from "zustand";

type EmployeeSheetState = {
  isOpen: boolean;
  mode:
    | "details"
    | "skills"
    | "edit"
    | "change object"
    | "remove"
    | "archive"
    | "create"
    | null;
  selectedEmployee: Employee | null;
  openSheet: (
    mode: EmployeeSheetState["mode"],
    employee?: Employee | null
  ) => void;
  closeSheet: () => void;
};

export const useEmployeeSheetStore = create<EmployeeSheetState>((set) => ({
  isOpen: false,
  mode: null,
  selectedEmployee: null,
  openSheet: (mode, employee = null) =>
    set({ isOpen: true, mode, selectedEmployee: employee }),
  closeSheet: () => set({ isOpen: false, mode: null, selectedEmployee: null }),
}));
