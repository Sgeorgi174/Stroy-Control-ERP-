import type { Employee } from "@/types/employee";
import { EmployeeClothesTable } from "../tables/employee's-clothes";
import { useGetEmployeeDebtDetails } from "@/hooks/employee/useGetEmployeeDebtDetails";
import { EmployeeDetailsBox } from "./details-box";
import { EmployeeSkillsBox } from "./skills-box";

type EmployeeDetailsProps = { employee: Employee };

export function EmployeeDetails({ employee }: EmployeeDetailsProps) {
  const { data, isError, isLoading } = useGetEmployeeDebtDetails(employee.id);

  return (
    <div className="p-5 flex flex-col gap-1">
      <EmployeeDetailsBox employee={employee} />
      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
      <EmployeeSkillsBox employee={employee} />

      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />

      <p className="text-center font-medium text-xl mt-6">Спецодежда</p>
      <p>
        Размер одежды:{" "}
        <span className="font-medium">{`${employee.clothingSize}`}</span>
      </p>
      <p>
        Размер обуви:{" "}
        <span className="font-medium">{`${employee.footwearSize}`}</span>
      </p>
      {data && (
        <EmployeeClothesTable
          items={data?.items}
          isLoading={isLoading}
          isError={isError}
        />
      )}
    </div>
  );
}
