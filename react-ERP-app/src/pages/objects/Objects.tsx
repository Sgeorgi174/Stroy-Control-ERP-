import { ObjectsFilter } from "@/components/dashboard/objects/objects-filter";
import { ObjectsTable } from "@/components/dashboard/objects/tables/objects-table";
import { objects } from "@/constants/objects";

export function Objects() {
  return (
    <div>
      <ObjectsFilter />
      <ObjectsTable objects={objects} />
    </div>
  );
}
