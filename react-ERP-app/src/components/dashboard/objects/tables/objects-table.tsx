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
import { StatusBadge } from "../../storage/tables/status-badge";
import { CircleCheck, PauseIcon } from "lucide-react";

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
            <TableHead className="text-secondary font-bold">
              Наименование
            </TableHead>
            <TableHead className="text-secondary font-bold">Адрес</TableHead>
            <TableHead className="text-secondary font-bold">Бригадир</TableHead>
            <TableHead className="text-secondary font-bold">Телефон</TableHead>
            <TableHead className="text-secondary font-bold">Статус</TableHead>
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
            <TableRow
              key={object.id}
              onClick={() => openSheet("details", object)}
              className="cursor-pointer"
            >
              <TableCell className="font-medium hover:underline">
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
              <TableCell>
                <StatusBadge
                  Icon={object.isPending ? PauseIcon : CircleCheck}
                  color={object.isPending ? "#807F7F" : "#23732E"}
                  text={object.isPending ? "На паузе" : "Активен"}
                ></StatusBadge>
              </TableCell>
              <TableCell>
                <div onClick={(e) => e.stopPropagation()}>
                  <ObjectDropDown object={object} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
