import { ObjectsFilter } from "@/components/dashboard/objects/objects-filter";
import { ObjectsSheet } from "@/components/dashboard/objects/sheets/object-sheet";
import { ObjectsTable } from "@/components/dashboard/objects/tables/objects-table";
import { objects } from "@/constants/objects";

export function Objects() {
  return (
    <div>
      <ObjectsFilter />
      <ObjectsTable objects={objects} />
      <ObjectsSheet />
    </div>
  );
}
