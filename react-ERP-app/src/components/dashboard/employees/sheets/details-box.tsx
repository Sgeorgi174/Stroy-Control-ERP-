import { positionMap } from "@/constants/positionMap";
import type { Employee } from "@/types/employee";

type EmployeeDetailsBoxProps = { employee: Employee };

export function EmployeeDetailsBox({ employee }: EmployeeDetailsBoxProps) {
  return (
    <>
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
    </>
  );
}
