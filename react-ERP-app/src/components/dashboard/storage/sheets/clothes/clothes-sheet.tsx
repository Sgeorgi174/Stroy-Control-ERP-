import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import { ClothesAdd } from "./clothes-add";
import { ClothesEdit } from "./clothes-edit";
import { ClothesTransfer } from "./clothes-transfer";
import { ClothesDetails } from "./clothes-details";

export function ClothesSheet() {
  const { isOpen, mode, selectedClothes, closeSheet } = useClothesSheetStore();

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="w-[750px] sm:max-w-[1000px]">
        <SheetHeader>
          <SheetTitle className="text-center text-xl font-medium">
            {mode === "add" && "Добавление одежды"}
            {mode === "edit" && `Редактирование: ${selectedClothes?.name}`}
            {mode === "transfer" && `Перемещение: ${selectedClothes?.name}`}
            {mode === "details" && `${selectedClothes?.name}`}
          </SheetTitle>
          <SheetDescription className="text-center">
            {mode === "add" && "Заполните данные о новой спец. одежде"}
            {mode === "edit" && `Редактирование выбранного комплекта одежды`}
            {mode === "transfer" &&
              `Заполните данные о перемещении комплекта одежды`}
            {mode === "details" && `Подробная информация о комплекте одежды`}
          </SheetDescription>
        </SheetHeader>

        {mode === "add" && <ClothesAdd />}
        {mode === "edit" && selectedClothes && (
          <ClothesEdit clothes={selectedClothes} />
        )}
        {mode === "transfer" && selectedClothes && (
          <ClothesTransfer clothes={selectedClothes} />
        )}
        {mode === "details" && selectedClothes && (
          <ClothesDetails clothes={selectedClothes} />
        )}
      </SheetContent>
    </Sheet>
  );
}
