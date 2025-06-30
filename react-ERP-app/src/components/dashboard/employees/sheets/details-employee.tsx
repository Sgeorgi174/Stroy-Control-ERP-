import { positionMap } from "@/constants/positionMap";
import type { Employee } from "@/types/employee";
import { EmployeeClothesTable } from "../tables/employee's-clothes";
import { useGetEmployeeDebtDetails } from "@/hooks/employee/useGetEmployeeDebtDetails";

type EmployeeDetailsProps = { employee: Employee };

export function EmployeeDetails({ employee }: EmployeeDetailsProps) {
  const { data, isError, isLoading } = useGetEmployeeDebtDetails(employee.id);

  console.log(data);

  return (
    <>
      <div className="p-5 flex flex-col gap-1">
        <p>
          ФИО:{" "}
          <span className="font-medium">{`${employee.lastName} ${employee.firstName} ${employee.fatherName}`}</span>
        </p>
        <p>
          Телефон: <span className="font-medium">{employee.phoneNumber}</span>
        </p>
        <p>
          Должность :{" "}
          <span className="font-medium"> {positionMap[employee.position]}</span>
        </p>
        <p>
          Объект:{" "}
          <span className="font-medium">
            {" "}
            {employee.workPlace ? employee.workPlace.name : "-"}
          </span>
        </p>
        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
        <div className="flex mt-6">
          <p>Навыки: </p>
          <div className="flex flex-col items-start gap-2">
            {employee.skills.map((skill) => (
              <p
                className=" text-center px-2 rounded-2xl font-medium"
                key={skill.id}
              >
                - {skill.skill}
              </p>
            ))}
          </div>
        </div>

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
    </>
  );
}
