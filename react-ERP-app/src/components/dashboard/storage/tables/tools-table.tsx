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

type ToolsTableProps = {
  tools: Tool[];
};

export function ToolsTable({ tools }: ToolsTableProps) {
  return (
    <Table className="mt-6">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Серийный №</TableHead>
          <TableHead>Наименование</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Место хранения</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tools.map((tool) => (
          <TableRow key={tool.id}>
            <TableCell className="font-medium">{tool.serialNumber}</TableCell>
            <TableCell>{tool.name}</TableCell>
            <TableCell>
              {tool.status === "ON_OBJECT" ? "На объекте" : "В пути"}
            </TableCell>
            <TableCell>{tool.storage.name}</TableCell>
            <TableCell>
              <ToolsDropDown tool={tool} /> {/* 💡 ВАЖНО */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
