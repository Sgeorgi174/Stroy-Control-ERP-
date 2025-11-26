// src/store/useObjectHeaderStore.ts
import { create } from "zustand";

type ObjectHeaderStore = {
  objectName: string | null;
  setObjectName: (name: string | null) => void;
  reset: () => void;
};

export const useObjectHeaderStore = create<ObjectHeaderStore>((set) => ({
  objectName: null,

  setObjectName: (name) => set({ objectName: name }),

  reset: () => set({ objectName: null }),
}));
