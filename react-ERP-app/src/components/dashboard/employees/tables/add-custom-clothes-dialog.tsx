"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { IssueCustomClothesDto } from "@/types/dto/clothes.dto";
import { useIssueCustomClothes } from "@/hooks/employee/useIssueCustomClothes";
import type { Season } from "@/types/season";
import type { ClothesType } from "@/types/clothes";

type AddCustomClothesDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  employeeId: string;
};

export function AddCustomClothesDialog({
  open,
  setOpen,
  employeeId,
}: AddCustomClothesDialogProps) {
  const [newClothing, setNewClothing] = React.useState<IssueCustomClothesDto>({
    name: "",
    size: "",
    heigh: "",
    price: 0,
    type: "CLOTHING",
    season: "SUMMER",
  });

  const issueMutation = useIssueCustomClothes(employeeId);

  const handleAddClothing = () => {
    issueMutation.mutate(newClothing, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Добавить одежду вручную</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Наименование</label>
            <Input
              value={newClothing.name}
              onChange={(e) =>
                setNewClothing({ ...newClothing, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Размер</label>
            <Input
              value={newClothing.size}
              onChange={(e) =>
                setNewClothing({ ...newClothing, size: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Ростовка</label>
            <Input
              value={newClothing.heigh}
              onChange={(e) =>
                setNewClothing({ ...newClothing, heigh: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Цена</label>
            <Input
              type="number"
              value={newClothing.price}
              onChange={(e) =>
                setNewClothing({
                  ...newClothing,
                  price: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Тип</label>
            <Select
              value={newClothing.type}
              onValueChange={(value) =>
                setNewClothing({ ...newClothing, type: value as ClothesType })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CLOTHING">Одежда</SelectItem>
                <SelectItem value="FOOTWEAR">Обувь</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Сезон</label>
            <Select
              value={newClothing.season}
              onValueChange={(value) =>
                setNewClothing({ ...newClothing, season: value as Season })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите сезон" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUMMER">Лето</SelectItem>
                <SelectItem value="WINTER">Зима</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button onClick={handleAddClothing}>Добавить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
