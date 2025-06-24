import type { DeviceStatus } from "@/types/device";
import type { ObjectStatus } from "@/types/object";
import type { TabletStatus } from "@/types/tablet";
import type { TabKey } from "@/types/tabs";
import type { ToolStatus } from "@/types/tool";
import { create } from "zustand";

type TabState = {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;

  selectedSeason: "SUMMER" | "WINTER" | null;
  setSelectedSeason: (season: "SUMMER" | "WINTER" | null) => void;

  selectedTabletStatus: TabletStatus | null;
  setSelectedTabletStatus: (status: TabletStatus | null) => void;

  selectedItemStatus: DeviceStatus | ToolStatus | null;
  setSelectedItemStatus: (status: DeviceStatus | ToolStatus | null) => void;

  selectedObjectStatus: ObjectStatus;
  setSetelectedObjectStatus: (status: ObjectStatus) => void;

  resetFilters: () => void;
};

export const useFilterPanelStore = create<TabState>((set) => ({
  activeTab: "tool",
  setActiveTab: (tab) => set({ activeTab: tab }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  selectedObjectId: null,
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),

  selectedSeason: null,
  setSelectedSeason: (season) => set({ selectedSeason: season }),

  selectedTabletStatus: null,
  setSelectedTabletStatus: (status) => set({ selectedTabletStatus: status }),

  selectedItemStatus: null,
  setSelectedItemStatus: (status) => set({ selectedItemStatus: status }),

  selectedObjectStatus: "OPEN",
  setSetelectedObjectStatus: (status) => set({ selectedObjectStatus: status }),

  resetFilters: () =>
    set({
      searchQuery: "",
      selectedObjectId: null,
      selectedSeason: null,
      selectedTabletStatus: null,
      selectedItemStatus: null,
      selectedObjectStatus: "OPEN",
    }),
}));
