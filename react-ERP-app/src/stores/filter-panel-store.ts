import type { DeviceStatus } from "@/types/device";
import type { EmployeeStatuses, Positions } from "@/types/employee";
import type { ObjectStatus } from "@/types/object";
import type { TabletStatus } from "@/types/tablet";
import type { TabKey } from "@/types/tabs";
import type { ToolStatus } from "@/types/tool";
import type { PendingStatus } from "@/types/transfers";
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

  selectedEmployeePosition: Positions | null;
  setSetelectedEmployeePosition: (position: Positions | null) => void;

  selectedEmployeeType: "ACTIVE" | "ARCHIVE";
  setSetelectedEmployeeType: (type: "ACTIVE" | "ARCHIVE") => void;

  selectedEmployeeStatus: EmployeeStatuses | null;
  setSetelectedEmployeeStatus: (status: EmployeeStatuses | null) => void;

  selectedTransferStatus: PendingStatus | null;
  setSelectedTransferStatus: (status: PendingStatus | null) => void;

  selectedTransferDate: Date;
  setSelectedTransferDate: (date: Date) => void;

  fromObjectId: string | null;
  setFromObjectId: (id: string | null) => void;

  toObjectId: string | null;
  setToObjectId: (id: string | null) => void;

  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  toggleSkill: (skillId: string) => void;

  resetFilters: () => void;
};

export const useFilterPanelStore = create<TabState>((set, get) => ({
  activeTab: "tool",
  setActiveTab: (tab) => set({ activeTab: tab }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  selectedObjectId: "all",
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),

  selectedSeason: null,
  setSelectedSeason: (season) => set({ selectedSeason: season }),

  selectedTabletStatus: null,
  setSelectedTabletStatus: (status) => set({ selectedTabletStatus: status }),

  selectedItemStatus: null,
  setSelectedItemStatus: (status) => set({ selectedItemStatus: status }),

  selectedObjectStatus: "OPEN",
  setSetelectedObjectStatus: (status) => set({ selectedObjectStatus: status }),

  selectedEmployeePosition: null,
  setSetelectedEmployeePosition: (position) =>
    set({ selectedEmployeePosition: position }),

  selectedEmployeeType: "ACTIVE",
  setSetelectedEmployeeType: (type) => set({ selectedEmployeeType: type }),

  selectedEmployeeStatus: null,
  setSetelectedEmployeeStatus: (status) =>
    set({ selectedEmployeeStatus: status }),

  selectedTransferStatus: null,
  setSelectedTransferStatus: (status) =>
    set({ selectedTransferStatus: status }),

  selectedTransferDate: new Date(),
  setSelectedTransferDate: (date) => set({ selectedTransferDate: date }),

  fromObjectId: "all",
  setFromObjectId: (id) => set({ fromObjectId: id }),

  toObjectId: "all",
  setToObjectId: (id) => set({ toObjectId: id }),

  selectedSkills: [],
  setSelectedSkills: (skills) => set({ selectedSkills: skills }),
  toggleSkill: (skillId) => {
    const current = get().selectedSkills;
    if (current.includes(skillId)) {
      set({ selectedSkills: current.filter((id) => id !== skillId) });
    } else {
      set({ selectedSkills: [...current, skillId] });
    }
  },

  resetFilters: () =>
    set({
      searchQuery: "",
      selectedObjectId: "all",
      selectedSeason: null,
      selectedTabletStatus: null,
      selectedItemStatus: null,
      selectedEmployeePosition: null,
      selectedObjectStatus: "OPEN",
      selectedEmployeeType: "ACTIVE",
      selectedSkills: [],
      selectedTransferDate: new Date(),
      fromObjectId: "all",
      toObjectId: "all",
    }),
}));
