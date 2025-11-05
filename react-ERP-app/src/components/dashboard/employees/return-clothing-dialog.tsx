import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Object } from "@/types/object";

type ReturnClothingDialogProps = {
  clothingId: string;
  employeeClothingId: string;
  employeeId: string;
  objects: Object[];
  onReturn: (dto: {
    clothesId: string;
    employeeClothingId: string;
    employeeId: string;
    objectId: string;
  }) => void;
};

export function ReturnClothingDialog({
  clothingId,
  employeeClothingId,
  employeeId,
  objects,
  onReturn,
}: ReturnClothingDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedObject, setSelectedObject] = React.useState<
    string | undefined
  >(undefined);

  const handleConfirm = () => {
    if (!selectedObject) return;
    onReturn({
      clothesId: clothingId,
      employeeClothingId,
      employeeId,
      objectId: selectedObject,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 p-2">Возврат</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Выберите объект для возврата</DialogTitle>
        </DialogHeader>
        <Select onValueChange={setSelectedObject} defaultValue={selectedObject}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите объект" />
          </SelectTrigger>
          <SelectContent>
            {objects.map((obj) => (
              <SelectItem key={obj.id} value={obj.id}>
                {obj.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={!selectedObject}>
            Подтвердить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
