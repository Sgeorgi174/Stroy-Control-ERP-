import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisVertical } from "lucide-react";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import type { Tool } from "@/types/tool";

export function ToolsDropDown({ tool }: { tool: Tool }) {
  const { openSheet } = useToolsSheetStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => openSheet("details", tool)}>
          Подробнее
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openSheet("edit", tool)}>
          Редактировать
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openSheet("transfer", tool)}>
          Переместить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
