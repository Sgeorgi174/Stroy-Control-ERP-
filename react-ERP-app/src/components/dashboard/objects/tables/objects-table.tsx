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

type ObjectsTableProps = {
  objects: Object[];
};

export function ObjectsTable({ objects }: ObjectsTableProps) {
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
          {objects.map((object) => (
            <TableRow key={object.id}>
              <TableCell></TableCell>
              <TableCell className="font-medium">{object.name}</TableCell>
              <TableCell>{object.address}</TableCell>
              <TableCell>{`${object.user.lastName} ${object.user.firstName}`}</TableCell>
              <TableCell>{object.user.phoneNumber}</TableCell>
              <TableCell>{object.employees}</TableCell>
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
