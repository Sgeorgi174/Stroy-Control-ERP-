import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToolsDropDown } from "../dropdowns/tools-dropdown";
import type { Tool } from "@/types/tool";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";

type ToolsTableProps = {
  tools: Tool[];
};

const toolStatusMap = {
  ON_OBJECT: "На объекте",
  IN_TRANSIT: "В пути",
  IN_REPAIR: "На ремонте",
  LOST: "Утерян",
  WRITTEN_OFF: "Списан",
};

export function ToolsTable({ tools }: ToolsTableProps) {
  const { openSheet } = useToolsSheetStore();

  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-primary pointer-events-none">
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead className="text-secondary font-bold">
              Серийный №
            </TableHead>
            <TableHead className="text-secondary font-bold">
              Наименование
            </TableHead>
            <TableHead className="text-secondary font-bold">Статус</TableHead>
            <TableHead className="text-secondary font-bold">Бригадир</TableHead>
            <TableHead className="text-secondary font-bold">Телефон</TableHead>
            <TableHead className="text-secondary font-bold">
              Место хранения
            </TableHead>

            <TableHead className="text-secondary font-bold"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tools.map((tool) => (
            <TableRow key={tool.id}>
              <TableCell></TableCell>
              <TableCell className="font-medium">{tool.serialNumber}</TableCell>
              <TableCell
                onClick={() => openSheet("details", tool)}
                className=" cursor-pointer hover:underline"
              >
                {tool.name}
              </TableCell>
              <TableCell>{toolStatusMap[tool.status]}</TableCell>
              <TableCell>{`${tool.user.lastName} ${tool.user.firstName}`}</TableCell>
              <TableCell>{tool.user.phoneNumber}</TableCell>
              <TableCell>{tool.storage.name}</TableCell>
              <TableCell>
                <ToolsDropDown tool={tool} /> {/* 💡 ВАЖНО */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
