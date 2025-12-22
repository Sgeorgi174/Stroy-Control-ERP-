"use client";

import { useState } from "react";
import type { EmployeeClothingItem } from "@/types/employeesClothing";

import { useObjects } from "@/hooks/object/useObject";
import { useReturnFromEmployee } from "@/hooks/clothes/useClothes";

import { StockClothesTable } from "./stock-clothes-table";
import { CustomClothesTable } from "./custom-clothes-table";
import { AddCustomClothesDialog } from "./add-custom-clothes-dialog";

type EmployeeClothesTableProps = {
  items: EmployeeClothingItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isWarning: boolean;
  employeeId: string;
  handleWriteOffDebt: (clothing: EmployeeClothingItem) => void;
  handleReduceDebt: (clothing: EmployeeClothingItem) => void;
};

export function EmployeeClothesTable({
  items,
  isLoading,
  isError,
  isWarning,
  employeeId,
  handleReduceDebt,
  handleWriteOffDebt,
}: EmployeeClothesTableProps) {
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const returnMutation = useReturnFromEmployee();

  const [openReturnDialogId, setOpenReturnDialogId] = useState<string | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleReturn = (dto: {
    clothesId: string;
    employeeClothingId: string;
    employeeId: string;
    objectId: string;
  }) => {
    returnMutation.mutate(dto);
  };

  const stockClothes = items?.filter((i) => !i.customClothes) ?? [];
  const customClothes = items?.filter((i) => i.customClothes) ?? [];

  return (
    <div className="space-y-6">
      {/* Одежда со склада */}
      <StockClothesTable
        items={stockClothes}
        isLoading={isLoading}
        isError={isError}
        isWarning={isWarning}
        employeeId={employeeId}
        objects={objects}
        openDialogId={openReturnDialogId}
        setOpenDialogId={setOpenReturnDialogId}
        onReturn={handleReturn}
        onReduceDebt={handleReduceDebt}
        onWriteOffDebt={handleWriteOffDebt}
      />

      {/* Кастомная одежда */}
      <CustomClothesTable
        items={customClothes}
        isLoading={isLoading}
        isError={isError}
        isWarning={isWarning}
        onAddClick={() => setIsAddDialogOpen(true)}
        onReduceDebt={handleReduceDebt}
        onWriteOffDebt={handleWriteOffDebt}
      />

      {/* Диалог добавления кастомной одежды */}
      <AddCustomClothesDialog
        open={isAddDialogOpen}
        setOpen={setIsAddDialogOpen}
        employeeId={employeeId}
      />
    </div>
  );
}
