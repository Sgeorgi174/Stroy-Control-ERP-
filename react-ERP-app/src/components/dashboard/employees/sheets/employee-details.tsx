import type { Employee } from "@/types/employee";
import { EmployeeClothesTable } from "../tables/employee's-clothes";
import { useGetEmployeeDebtDetails } from "@/hooks/employee/useGetEmployeeDebtDetails";
import { EmployeeDetailsBox } from "./details-box";
import { EmployeeSkillsBox } from "./skills-box";
import { useState } from "react";
import type { EmployeeClothingItem } from "@/types/employeesClothing";
import { DebtActionDialog } from "./debt-action-dialog";
import { useChangeEmployeeDebt } from "@/hooks/employee/useChangeEmployeeDebt";

type EmployeeDetailsProps = { employee: Employee };

export function EmployeeDetails({ employee }: EmployeeDetailsProps) {
  const { data, isError, isLoading } = useGetEmployeeDebtDetails(employee.id);
  const [selectedClothing, setSelectedClothing] =
    useState<EmployeeClothingItem | null>(null);
  const [dialogType, setDialogType] = useState<"reduce" | "writeoff">("reduce");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const mutationEmployeeDebt = useChangeEmployeeDebt(
    selectedClothing ? selectedClothing.id : ""
  );

  const handleConfirmAction = (amount: number) => {
    if (!selectedClothing) return;

    if (dialogType === "reduce") {
      mutationEmployeeDebt.mutate({ debt: amount });
    } else {
      mutationEmployeeDebt.mutate({ debt: amount });
    }
  };

  const handleReduceDebt = (clothing: EmployeeClothingItem) => {
    setSelectedClothing(clothing);
    setDialogType("reduce");
    setIsDialogOpen(true);
  };

  const handleWriteOffDebt = (clothing: EmployeeClothingItem) => {
    setSelectedClothing(clothing);
    setDialogType("writeoff");
    setIsDialogOpen(true);
  };

  return (
    <div className="p-5 flex flex-col gap-5">
      <EmployeeDetailsBox employee={employee} />
      <EmployeeSkillsBox employee={employee} />

      <EmployeeClothesTable
        items={data ? data.items : undefined}
        isLoading={isLoading}
        isError={isError}
        handleReduceDebt={handleReduceDebt}
        handleWriteOffDebt={handleWriteOffDebt}
      />

      {selectedClothing && (
        <DebtActionDialog
          clothing={selectedClothing}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onConfirm={handleConfirmAction}
          actionType={dialogType}
        />
      )}
    </div>
  );
}
