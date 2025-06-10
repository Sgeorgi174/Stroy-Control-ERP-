import type { TabKey } from "@/components/dashboard/storage/filter-panel/tabs";
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
}));
