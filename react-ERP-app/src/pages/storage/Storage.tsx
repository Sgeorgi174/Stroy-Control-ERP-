import { StorageFilters } from "@/components/dashboard/storage/storage-filters";
import { ClothesSheet } from "@/components/dashboard/storage/sheets/clothes/clothes-sheet";
import { ToolsSheet } from "@/components/dashboard/storage/sheets/tools/tools-sheet";
import { ClothesTable } from "@/components/dashboard/storage/tables/clothes-table";
import { clothes_and_footwear } from "@/constants/clothes_and_footwear";
import { tools } from "@/constants/tools";
import { ToolsTable } from "@/components/dashboard/storage/tables/tools-table";
import { filterClothes } from "@/lib/utils/filterClothes";
import { filterTools } from "@/lib/utils/filterTools";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { TabletsTable } from "@/components/dashboard/storage/tables/tablets-table";
import { tablets } from "@/constants/tablets";
import { DevicesTable } from "@/components/dashboard/storage/tables/devices-table";
import { devices } from "@/constants/devices";
import { filterDevices } from "@/lib/utils/filterDevices";
import { filterTablets } from "@/lib/utils/filterTablets";
import { DeviceSheet } from "@/components/dashboard/storage/sheets/devices/device-sheet";
import type { ToolStatus } from "@/types/tool";
import type { DeviceStatus } from "@/types/device";
import { TabletSheet } from "@/components/dashboard/storage/sheets/tablet/tablet-sheet";

export function Storage() {
  const {
    activeTab,
    searchQuery,
    selectedObjectId,
    selectedSeason,
    selectedTabletStatus,
    selectedItemStatus,
  } = useFilterPanelStore();

  const filteredClothes = filterClothes({
    data: clothes_and_footwear,
    activeTab,
    searchQuery,
    selectedObjectId,
    selectedSeason,
  });

  const filteredTools = filterTools({
    data: tools,
    searchQuery,
    selectedObjectId,
    selectedItemStatus: selectedItemStatus as ToolStatus | null,
  });

  const filteredDevices = filterDevices({
    data: devices,
    searchQuery,
    selectedObjectId,
    selectedItemStatus: selectedItemStatus as DeviceStatus | null,
  });

  const filteredTablets = filterTablets({
    data: tablets,
    searchQuery,
    selectedStatus: selectedTabletStatus,
  });

  return (
    <div>
      <StorageFilters />
      {activeTab === "tablet" && (
        <div>
          <TabletsTable tablets={filteredTablets} /> <TabletSheet />
        </div>
      )}

      {activeTab === "tool" && (
        <div>
          <ToolsTable tools={filteredTools} /> <ToolsSheet />
        </div>
      )}

      {activeTab === "device" && (
        <div>
          <DevicesTable devices={filteredDevices} /> <DeviceSheet />
        </div>
      )}

      {activeTab === "clothing" && (
        <div>
          <ClothesTable clothes={filteredClothes} /> <ClothesSheet />
        </div>
      )}

      {activeTab === "footwear" && (
        <div>
          <ClothesTable clothes={filteredClothes} /> <ClothesSheet />
        </div>
      )}
    </div>
  );
}
