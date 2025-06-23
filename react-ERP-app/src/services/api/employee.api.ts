import { api } from "@/lib/api";
import type {
  CreateEmployeeDto,
  TransferEmployeeDto,
  UpdateEmployeeDto,
} from "@/types/dto/employee.dto";
import type { Employee, Positions, Statuses } from "@/types/employee";

export const getFilteredEmployees = async (params: {
  searchQuery: string;
  objectId?: string | null;
  status?: Statuses | null;
  position?: Positions | null;
}) => {
  const res = await api.get("/employees/filter", {
    params: {
      serialNumber: params.searchQuery || undefined,
      objectId: params.objectId || undefined,
      status: params.status || undefined,
      position: params.position || undefined,
    },
  });
  return res.data;
};

// Получить инструмент по id
export const getDeviceById = async (id: string): Promise<Employee> => {
  const res = await api.get(`/employees/by-id/${id}`);
  return res.data;
};

// Создать инструмент
export const createEmployee = async (
  data: CreateEmployeeDto
): Promise<Employee> => {
  const res = await api.post("/employees/create", data);
  return res.data;
};

// Обновить инструмент
export const updateEmployee = async (
  id: string,
  data: UpdateEmployeeDto
): Promise<Employee> => {
  const res = await api.put(`/employees/update/${id}`, data);
  return res.data;
};

// Передать инструмент
export const transferEmployee = async (
  id: string,
  data: TransferEmployeeDto
): Promise<{ transferredEmployee: Employee }> => {
  const res = await api.patch(`/employees/transfer/${id}`, data);
  return res.data;
};

// Удалить инструмент
export const deleteEmployee = async (id: string): Promise<void> => {
  await api.delete(`/employees/delete/${id}`);
};
