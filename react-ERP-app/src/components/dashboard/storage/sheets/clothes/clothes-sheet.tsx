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
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { Shirt } from "lucide-react";
import { BootIcon } from "@/components/ui/boot";

export function ClothesSheet() {
  const { isOpen, mode, selectedClothes, closeSheet } = useClothesSheetStore();
  const { activeTab } = useFilterPanelStore();

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent
        className="w-[700px] sm:max-w-[1000px] overflow-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="text-center text-xl font-medium">
            {mode === "create" ? (
              `Добавление ${activeTab === "clothing" ? "одежды" : "обуви"}`
            ) : (
              <div>
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    {activeTab === "clothing" ? (
                      <Shirt className="w-6 h-6 text-blue-600" />
                    ) : (
                      <BootIcon className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <p>{selectedClothes?.name}</p>
                    <div className="flex items-center text-muted-foreground gap-8">
                      <p className="text-lg text-muted-foreground">
                        Сезон:{" "}
                        {selectedClothes?.season === "SUMMER" ? "Лето" : "Зима"}
                      </p>
                      <p className="text-lg text-muted-foreground">
                        Артикул: {selectedClothes?.partNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SheetTitle>
          <SheetDescription className="text-center  text-transparent w-0 h-0">
            {mode === "create" &&
              `Заполните данные о новой ${
                activeTab === "clothing" ? "спец. одежде" : "обуви"
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
