import { useState, useRef, useEffect } from "react";
import type { Employee } from "@/types/employee";
import { Input } from "../ui/input";

type EmployeeAutocompleteProps = {
  employees: Employee[];
  selectedEmployeeId: string;
  onSelectChange: (id: string) => void;
  disabled?: boolean;
};

export function EmployeeAutocomplete({
  employees,
  selectedEmployeeId,
  onSelectChange,
  disabled,
}: EmployeeAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Фильтрация по имени
  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.lastName} ${employee.firstName} ${
      employee.fatherName ?? ""
    }`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // Закрыть список при клике вне компонента
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const employee = employees.find((e) => e.id === selectedEmployeeId);
    if (employee) {
      setSearchTerm(
        `${employee.lastName} ${employee.firstName} ${
          employee.fatherName ?? ""
        }`
      );
    } else {
      setSearchTerm("");
    }
  }, [selectedEmployeeId, employees]);

  // При выборе сотрудника
  const handleSelect = (id: string) => {
    const employee = employees.find((e) => e.id === id);
    if (employee) {
      setSearchTerm(
        `${employee.lastName} ${employee.firstName} ${
          employee.fatherName ?? ""
        }`
      );
      onSelectChange(id);
      setIsOpen(false);
    }
  };

  // При фокусе показывать список
  const handleFocus = () => {
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-[250px]">
      <Input
        value={searchTerm}
        disabled={disabled}
        onChange={(e) => {
          const value = e.target.value;
          setSearchTerm(value);
          setIsOpen(true);

          // Сброс выбранного employeeId, если пользователь вводит произвольный текст
          if (selectedEmployeeId) {
            const selectedEmployee = employees.find(
              (e) => e.id === selectedEmployeeId
            );
            const selectedFullName = selectedEmployee
              ? `${selectedEmployee.lastName} ${selectedEmployee.firstName} ${
                  selectedEmployee.fatherName ?? ""
                }`.trim()
              : "";

            if (
              !value.trim() ||
              !selectedFullName.toLowerCase().includes(value.toLowerCase())
            ) {
              onSelectChange(""); // сбрасываем, если не совпадает
            }
          }
        }}
        onFocus={handleFocus}
        placeholder="Выберите сотрудника"
        autoComplete="off"
      />
      {isOpen && (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto bg-secondary rounded border shadow-md">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <li
                key={employee.id}
                onClick={() => handleSelect(employee.id)}
                className="cursor-pointer text-primary px-3 py-2 hover:bg-primary hover:text-accent"
              >
                {`${employee.lastName} ${employee.firstName} ${
                  employee.fatherName ?? ""
                }`}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500 select-none">
              Совпадений нет
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
