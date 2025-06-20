import type { Object } from "@/types/object";
import { EmployeesOnObjectTable } from "../tables/employees-on-object";
import { employees } from "@/constants/employees";

type ObjectDetailsProps = { object: Object };

export function ObjectDetails({ object }: ObjectDetailsProps) {
  return (
    <>
      <div className="p-5 flex flex-col gap-1">
        <p>
          Наименование: <span className="font-medium">{object.name}</span>
        </p>
        <p>
          Адрес: <span className="font-medium">{object.address}</span>
        </p>
        <p>
          Бригадир :{" "}
          <span className="font-medium">{`${object.user.firstName} ${object.user.lastName}`}</span>
        </p>
        <p>
          Телефон: <span className="font-medium">{object.user?.phone}</span>
        </p>
        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
        <p className="text-center font-medium text-xl mt-5">
          Список сотрудников
        </p>
        <EmployeesOnObjectTable
          employees={employees.filter(
            (employee) => employee.workPlace?.id === object.id
          )}
        />
      </div>
    </>
  );
}
