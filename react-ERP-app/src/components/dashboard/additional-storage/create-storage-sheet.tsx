import React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Warehouse } from "lucide-react";

interface CreateStorageSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function CreateStorageSheet({
  open,
  onOpenChange,
  name,
  onNameChange,
  onSubmit,
  isLoading,
}: CreateStorageSheetProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md p-4">
        <SheetHeader className="">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Warehouse className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Новый склад</SheetTitle>
              <SheetDescription>
                Создайте новое место хранения товаров
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="storage-name">Название склада</Label>
            <Input
              id="storage-name"
              placeholder="Например: Основной склад"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? "Создание..." : "Создать склад"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
