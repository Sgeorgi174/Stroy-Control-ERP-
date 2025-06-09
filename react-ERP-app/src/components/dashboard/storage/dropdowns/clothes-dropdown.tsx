import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import type { Clothes } from "@/types/clothes";

export function ClothesDropdown({ clothes }: { clothes: Clothes }) {
  const { openSheet } = useClothesSheetStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => openSheet("details", clothes)}>
          Подробнее
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openSheet("edit", clothes)}>
          Редактировать
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openSheet("transfer", clothes)}>
          Переместить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
