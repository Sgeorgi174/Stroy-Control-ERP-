import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useObjectSheetStore } from "@/stores/objects-sheet-store";
import { ObjectAdd } from "./object-add";
import { ObjectEdit } from "./object-edit";
import { ObjectDetails } from "./object-details";
import { ObjectAddEmployee } from "./object-add-employee";
import { CloseObject } from "./close-object/close-object";
import { ChangeForeman } from "./change-foreman";
import {
  AlertCircle,
  Building,
  CheckCircle,
  Clock,
  MapPin,
} from "lucide-react";
import type { ObjectStatus } from "@/types/object";
import { Badge } from "@/components/ui/badge";

const getStatusColor = (status: ObjectStatus) => {
  switch (status) {
    case "OPEN":
      return "bg-green-100 text-green-800";
    case "CLOSE":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: ObjectStatus) => {
  switch (status) {
    case "OPEN":
      return <CheckCircle className="w-4 h-4" />;
    case "CLOSE":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const objectStatusMap = {
  OPEN: "Открытый",
  CLOSE: "Закрытый",
};

export function ObjectsSheet() {
  const { isOpen, mode, selectedObject, closeSheet } = useObjectSheetStore();

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent
        className="w-[700px] sm:max-w-[1000px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="text-center text-xl font-medium">
            {mode === "add" ? (
              "Новый объект"
            ) : (
              <div>
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <p>{selectedObject?.name}</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <p className="text-lg text-muted-foreground">
                        {selectedObject?.address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-start mt-5 gap-2">
                  <Badge
                    className={`${getStatusColor(
                      selectedObject ? selectedObject.status : "OPEN"
                    )} flex items-center gap-1`}
                  >
                    {selectedObject && getStatusIcon(selectedObject.status)}
                    {selectedObject && objectStatusMap[selectedObject.status]}
                  </Badge>
                  {selectedObject && selectedObject.isPending && (
                    <Badge
                      variant="outline"
                      className="text-orange-600/80 border-orange-600/80"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      На паузе
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </SheetTitle>
          <SheetDescription className="text-center text-transparent w-0 h-0">
            {mode === "add" && "Добавление нового объекта"}
            {mode === "edit" && `Редактирвоание объекта`}
            {mode === "details" && `Подробная информация об объекте`}
            {mode === "change foreman" && `Смена бригадира на объекте`}
            {mode === "add employee" &&
              `Выберите сотрудников для назначения на объект`}
            {mode === "close object" &&
              `Подтверждения и сверка для закрытия объекта`}
          </SheetDescription>
        </SheetHeader>

        {mode === "add" && <ObjectAdd />}
        {mode === "edit" && selectedObject && (
          <ObjectEdit object={selectedObject} />
        )}
        {mode === "details" && selectedObject && (
          <ObjectDetails object={selectedObject} />
        )}
        {mode === "add employee" && selectedObject && (
          <ObjectAddEmployee object={selectedObject} />
        )}
        {mode === "close object" && selectedObject && (
          <CloseObject objectId={selectedObject.id} />
        )}
        {mode === "change foreman" && selectedObject && (
          <ChangeForeman object={selectedObject} />
        )}
      </SheetContent>
    </Sheet>
  );
}
