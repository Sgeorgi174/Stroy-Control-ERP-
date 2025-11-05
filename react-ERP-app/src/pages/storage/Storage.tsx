import { StorageFilters } from "@/components/dashboard/storage/storage-filters";
import { ClothesSheet } from "@/components/dashboard/storage/sheets/clothes/clothes-sheet";
import { ToolsSheet } from "@/components/dashboard/storage/sheets/tools/tools-sheet";
import { ClothesTable } from "@/components/dashboard/storage/tables/clothes-table";
import { ToolsTable } from "@/components/dashboard/storage/tables/tools-table";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { TabletsTable } from "@/components/dashboard/storage/tables/tablets-table";
import { DevicesTable } from "@/components/dashboard/storage/tables/devices-table";
import { DeviceSheet } from "@/components/dashboard/storage/sheets/devices/device-sheet";
import { TabletSheet } from "@/components/dashboard/storage/sheets/tablet/tablet-sheet";
import { useTools } from "@/hooks/tool/useTools";
import { useDevices } from "@/hooks/device/useDevices";
import { useClothes } from "@/hooks/clothes/useClothes";
import { useTablets } from "@/hooks/tablet/useTablet";
import { useMemo, useState } from "react";
import { ToolsTableBulk } from "@/components/dashboard/storage/tables/tools-table-bulk";

export function Storage() {
  const [isBulk, setIsBulk] = useState(false);

  const {
    activeTab,
    searchQuery,
    selectedObjectId,
    selectedSeason,
    selectedTabletStatus,
    selectedItemStatus,
  } = useFilterPanelStore();

  const {
    data: tools = [],
    isLoading: toolsLoading,
    isError: toolsError,
  } = useTools(
    {
      searchQuery,
      objectId: selectedObjectId,
      status: selectedItemStatus,
      isBulk: isBulk,
    },
    activeTab === "tool"
  );

  const {
    data: clothes = [],
    isLoading: clothesLoading,
    isError: clothesError,
  } = useClothes(
    {
      searchQuery,
      objectId: selectedObjectId,
      season: selectedSeason,
      type: activeTab === "clothing" ? "CLOTHING" : "FOOTWEAR",
    },
    activeTab === "clothing" || activeTab === "footwear"
  );

  const {
    data: devices = [],
    isLoading: devicesLoading,
    isError: devicesError,
  } = useDevices(
    {
      searchQuery,
      objectId: selectedObjectId,
      status: selectedItemStatus,
    },
    activeTab === "device"
  );

  const {
    data: tablets = [],
    isLoading: tabletsLoading,
    isError: tabletsError,
  } = useTablets(
    {
      searchQuery,
      status: selectedTabletStatus,
    },
    activeTab === "tablet"
  );

  const sortedClothes = useMemo(() => {
    return [...clothes].sort((a, b) => {
      let aSize = 0;
      let bSize = 0;

      if (activeTab === "clothing") {
        // clothingSize.size — строка вроде "48-50" → берём первый размер
        aSize = parseInt(a.clothingSize?.size?.split("-")[0] ?? "0");
        bSize = parseInt(b.clothingSize?.size?.split("-")[0] ?? "0");
      }

      if (activeTab === "footwear") {
        // footwearSize.size — строка вроде "42" → просто преобразуем в число
        aSize = parseInt(a.footwearSize?.size ?? "0");
        bSize = parseInt(b.footwearSize?.size ?? "0");
      }

      return aSize - bSize;
    });
  }, [clothes, activeTab]);

  return (
    <div>
      <StorageFilters isBulk={isBulk} setIsBulk={setIsBulk} />

      {activeTab === "tablet" && (
        <div>
          <TabletsTable
            tablets={tablets}
            isLoading={tabletsLoading}
            isError={tabletsError}
          />

          <TabletSheet />
        </div>
      )}

      {activeTab === "tool" && !isBulk && (
        <>
          <ToolsTable
            tools={tools}
            isLoading={toolsLoading}
            isError={toolsError}
          />
          <ToolsSheet />
        </>
      )}

      {activeTab === "tool" && isBulk && (
        <>
          <ToolsTableBulk
            tools={tools}
            isLoading={toolsLoading}
            isError={toolsError}
          />
          <ToolsSheet />
        </>
      )}

      {activeTab === "device" && (
        <div>
          <DevicesTable
            devices={devices}
            isLoading={devicesLoading}
            isError={devicesError}
          />
          <DeviceSheet />
        </div>
      )}

      {(activeTab === "clothing" || activeTab === "footwear") && (
        <div>
          <ClothesTable
            clothes={sortedClothes}
            isLoading={clothesLoading}
            isError={clothesError}
          />
          <ClothesSheet />
        </div>
      )}
    </div>
  );
}
