import type { Tablet } from "@/types/tablet";
import type { TabletStatus } from "@/types/tablet";

type Params = {
  data: Tablet[];
  searchQuery: string;
  selectedStatus: TabletStatus | null;
};

export function filterTablets({
  data,
  searchQuery,
  selectedStatus,
}: Params): Tablet[] {
  const lowerSearch = searchQuery.toLowerCase();

  return data
    .filter((item) => {
      if (selectedStatus) return item.status === selectedStatus;
      return true;
    })
    .filter((item) => {
      if (!searchQuery) return true;

      const employeeFullName = item.employee
        ? `${item.employee.firstName} ${item.employee.lastName} ${item.employee.phoneNumber}`
        : "";

      const searchFields = [
        item.name,
        item.serialNumber,
        employeeFullName,
      ].filter(Boolean);

      return searchFields.some((field) =>
        field.toLowerCase().includes(lowerSearch)
      );
    });
}
