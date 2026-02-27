import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DataMaskState {
  isMasked: boolean;
  toggleMask: () => void;
}

export const useDataMaskStore = create<DataMaskState>()(
  persist(
    (set) => ({
      isMasked: false,
      toggleMask: () => set((state) => ({ isMasked: !state.isMasked })),
    }),
    {
      name: "data-mask-storage", // Состояние сохранится после перезагрузки
    },
  ),
);
