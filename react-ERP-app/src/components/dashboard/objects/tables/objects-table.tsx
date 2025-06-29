import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Object } from "@/types/object";
import { ObjectDropDown } from "../dropdowns/object-dropdown";
import { PendingTable } from "../../storage/tables/pending-table";
import { splitAddress } from "@/lib/utils/splitAddress";
import { useObjectSheetStore } from "@/stores/objects-sheet-store";

type ObjectsTableProps = {
  objects: Object[];
  isError: boolean;
  isLoading: boolean;
};

export function ObjectsTable({
  objects,
  isError,
  isLoading,
}: ObjectsTableProps) {
  const { openSheet } = useObjectSheetStore();

  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-primary pointer-events-none">
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead className="text-secondary font-bold">
              Наименование
            </TableHead>
            <TableHead className="text-secondary font-bold">Адрес</TableHead>
            <TableHead className="text-secondary font-bold">Бригадир</TableHead>
            <TableHead className="text-secondary font-bold">Телефон</TableHead>
            <TableHead className="text-secondary font-bold">
              Кол-во сотрудников
            </TableHead>

            <TableHead className="text-secondary font-bold"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <PendingTable
            isError={isError}
            isLoading={isLoading}
            data={objects}
          />
          {objects.map((object) => (
            <TableRow key={object.id}>
              <TableCell></TableCell>
              <TableCell
                onClick={() => openSheet("details", object)}
                className="font-medium cursor-pointer hover:underline"
              >
                {object.name}
              </TableCell>
              <TableCell>{`г. ${splitAddress(object).city}, ул. ${
                splitAddress(object).street
              }, ${splitAddress(object).buldings}`}</TableCell>
              <TableCell>
                {object.foreman
                  ? `${object.foreman.lastName} ${object.foreman.firstName}`
                  : "Не назначен"}
              </TableCell>
              <TableCell>
                {object.foreman ? object.foreman.phone : "-"}
              </TableCell>
              <TableCell>{object.employees.length}</TableCell>
              <TableCell>
                <ObjectDropDown object={object} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
