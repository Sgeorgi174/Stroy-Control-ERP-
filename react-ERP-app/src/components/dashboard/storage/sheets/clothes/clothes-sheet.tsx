import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import { ClothesCreate } from "./clothes-create";
import { ClothesEdit } from "./clothes-edit";
import { ClothesTransfer } from "./clothes-transfer";
import { ClothesDetails } from "./clothes-details";
import { ClothesGive } from "./clothes-give";
import { ClothesAdd } from "./clothes-add";
import { ClothesWrittenOff } from "./clothes-written-off";

export function ClothesSheet() {
  const { isOpen, mode, selectedClothes, closeSheet } = useClothesSheetStore();

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent
        className="w-[750px] sm:max-w-[1000px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="text-center text-xl font-medium">
            {mode === "create" &&
              `Добавление ${
                selectedClothes?.type === "CLOTHING" ? "одежды" : "обуви"
              }`}
            {mode === "edit" && `Редактирование: ${selectedClothes?.name}`}
            {mode === "transfer" && `Перемещение: ${selectedClothes?.name}`}
            {mode === "details" && `${selectedClothes?.name}`}
            {mode === "give" &&
              `Выдача ${
                selectedClothes?.type === "CLOTHING" ? "одежды" : "обуви"
              }`}
            {mode === "add" &&
              `Пополнение ${
                selectedClothes?.type === "CLOTHING" ? "одежды" : "обуви"
              }`}
            {mode === "written_off" &&
              `Списание ${
                selectedClothes?.type === "CLOTHING" ? "одежды" : "обуви"
              }`}
          </SheetTitle>
          <SheetDescription className="text-center">
            {mode === "create" &&
              `Заполните данные о новой ${
                selectedClothes?.type === "CLOTHING" ? "спец. одежде" : "обуви"
              }`}
            {mode === "edit" &&
              `Редактирование ${
                selectedClothes?.type === "CLOTHING"
                  ? "выбранного комплекта одежды"
                  : "выбранной обуви"
              }`}
            {mode === "transfer" &&
              `Заполните данные о перемещении ${
                selectedClothes?.type === "CLOTHING"
                  ? "комплекта одежды"
                  : "обуви"
              }`}
            {mode === "details" &&
              `Подробная информация ${
                selectedClothes?.type === "CLOTHING"
                  ? "о комплекте одежды"
                  : "об обуви"
              } `}

            {mode === "give" &&
              `Выберите сотрудника для выдачи ему ${
                selectedClothes?.type === "CLOTHING" ? "одежды" : "обуви"
              }`}

            {mode === "add" &&
              `Укажите количество для пополнения ${
                selectedClothes?.type === "CLOTHING" ? "одежды" : "обуви"
              }`}
            {mode === "written_off" &&
              `Укажите количество для списания ${
                selectedClothes?.type === "CLOTHING" ? "одежды" : "обуви"
              }`}
          </SheetDescription>
        </SheetHeader>

        {mode === "create" && <ClothesCreate />}
        {mode === "edit" && selectedClothes && (
          <ClothesEdit clothes={selectedClothes} />
        )}
        {mode === "transfer" && selectedClothes && (
          <ClothesTransfer clothes={selectedClothes} />
        )}
        {mode === "details" && selectedClothes && (
          <ClothesDetails clothes={selectedClothes} />
        )}
        {mode === "give" && selectedClothes && (
          <ClothesGive clothes={selectedClothes} />
        )}
        {mode === "add" && selectedClothes && (
          <ClothesAdd clothes={selectedClothes} />
        )}
        {mode === "written_off" && selectedClothes && (
          <ClothesWrittenOff clothes={selectedClothes} />
        )}
      </SheetContent>
    </Sheet>
  );
}
