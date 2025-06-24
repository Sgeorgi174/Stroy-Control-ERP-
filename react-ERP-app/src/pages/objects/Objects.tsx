import { ObjectsFilter } from "@/components/dashboard/objects/objects-filter";
import { ObjectsSheet } from "@/components/dashboard/objects/sheets/object-sheet";
import { ObjectsTable } from "@/components/dashboard/objects/tables/objects-table";
import { useObjects } from "@/hooks/object/useObject";
import { useFilterPanelStore } from "@/stores/filter-panel-store";

export function Objects() {
  const { activeTab, searchQuery, selectedObjectStatus } =
    useFilterPanelStore();

  const {
    data: objects = [],
    isLoading,
    isError,
  } = useObjects(
    {
      searchQuery,
      status: selectedObjectStatus,
    },
    activeTab === "object"
  );

  return (
    <div>
      <ObjectsFilter />
      <ObjectsTable objects={objects} isLoading={isLoading} isError={isError} />
      <ObjectsSheet />
    </div>
  );
}
