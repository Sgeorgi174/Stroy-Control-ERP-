import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { AddButton } from "../filter-panel/add-button";
import { FilterPanel } from "../filter-panel/filter-panel";
import { SearchInput } from "../filter-panel/search-input";
import { ObjectSelectForFilter } from "../filter-panel/filter-object-select";
import { useObjects } from "@/hooks/object/useObject";
import { useEmployeeSheetStore } from "@/stores/employee-sheet-store";
import { useDebouncedState } from "@/hooks/useDebounceState";
import { useEffect } from "react";
import { PositionSelectForFilter } from "../filter-panel/filter-position-select";
import { SkillsFilterPopover } from "../filter-panel/filter-skills";
import { useSkill } from "@/hooks/skill/useSkill";
import { EmployeeTypeForFilter } from "../filter-panel/filter-employee-type";
import { EmployeeStatusForFilter } from "../filter-panel/filter-employee-status";

export function EmployeesFilter() {
  const { searchQuery, setSearchQuery } = useFilterPanelStore();
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });
  const { data: skills = [] } = useSkill();
  const openEmployeeSheet = useEmployeeSheetStore((s) => s.openSheet);
  const [localSearch, setLocalSearch, debouncedSearch] = useDebouncedState(
    searchQuery,
    700
  );

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const handleAdd = () => {
    openEmployeeSheet("create");
  };

  return (
    <FilterPanel>
      <div className="flex flex-wrap justify-start gap-y-6 gap-x-5">
        <div className="flex items-center gap-2">
          <p className="font-medium">Сотрудники:</p>
          <EmployeeTypeForFilter />
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <p className="font-medium">Объект:</p>
            <ObjectSelectForFilter objects={objects} nullElement={true} />
          </div>
          <div className="flex items-center gap-2">
            <p className="font-medium">Должность:</p>
            <PositionSelectForFilter />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-medium">Статус:</p>
          <EmployeeStatusForFilter />
        </div>
        <SkillsFilterPopover skills={skills} />

        <div className="flex gap-8">
          <AddButton handleAdd={handleAdd} />
          <SearchInput
            searchQuery={localSearch}
            setSearchQuery={setLocalSearch}
          />
        </div>
      </div>
    </FilterPanel>
  );
}
