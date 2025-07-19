import { api } from "@/lib/api";
import type {
  AddSkillsDto,
  ArchiveDto,
  AssignEmployeesDto,
  ChangeDebtDto,
  CreateEmployeeDto,
  RemoveSkillDto,
  TransferEmployeeDto,
  UpdateEmployeeDto,
} from "@/types/dto/employee.dto";
import type {
  Employee,
  EmployeeType,
  Positions,
  EmployeeStatuses,
} from "@/types/employee";
import type {
  EmployeeClothing,
  EmployeeClothingItem,
} from "@/types/employeesClothing";

export const getFilteredEmployees = async (params: {
  searchQuery: string;
  objectId?: string | null;
  status?: EmployeeStatuses | null;
  position?: Positions | null;
  type?: EmployeeType | null;
  skillIds?: string;
}): Promise<Employee[]> => {
  const res = await api.get("/employees/filter", {
    params: {
      searchQuery: params.searchQuery || undefined,
      objectId: params.objectId || undefined,
      status: params.status || undefined,
      position: params.position || undefined,
      skillIds: params.skillIds || undefined,
      type: params.type || undefined,
    },
  });
  return res.data;
};

export const getEmployeeById = async (id: string): Promise<Employee> => {
  const res = await api.get(`/employees/by-id/${id}`);
  return res.data;
};

export const getFreeEmployees = async (): Promise<Employee[]> => {
  const res = await api.get(`/employees/free-employees/`);
  return res.data;
};

export const createEmployee = async (
  data: CreateEmployeeDto
): Promise<Employee> => {
  const res = await api.post("/employees/create", data);
  return res.data;
};

export const updateEmployee = async (
  id: string,
  data: UpdateEmployeeDto
): Promise<Employee> => {
  const res = await api.put(`/employees/update/${id}`, data);
  return res.data;
};

export const transferEmployee = async (
  id: string,
  data: TransferEmployeeDto
): Promise<{ transferredEmployee: Employee }> => {
  const res = await api.patch(`/employees/transfer/${id}`, data);
  return res.data;
};

export const unassignFromObject = async (id: string): Promise<Employee> => {
  const res = await api.patch(`/employees/unassign/${id}`);
  return res.data;
};

export const assignToObject = async (data: AssignEmployeesDto) => {
  const res = await api.post(`/employees/assign/`, data);
  return res.data;
};

export const addSkill = async (id: string, data: AddSkillsDto) => {
  const res = await api.post(`/employees/add-skills/${id}`, data);
  return res.data;
};

export const removeSkill = async (id: string, data: RemoveSkillDto) => {
  const res = await api.patch(`/employees/remove-skill/${id}`, data);
  return res.data;
};

export const archiveEmployee = async (id: string, data: ArchiveDto) => {
  const res = await api.patch(`/employees/archive/${id}`, data);
  return res.data;
};

export const restoreEmployee = async (id: string) => {
  const res = await api.patch(`/employees/restore/${id}`);
  return res.data;
};

export const getEmployeeDebtDetails = async (
  id: string
): Promise<EmployeeClothing> => {
  const res = await api.get<EmployeeClothing>(`/employee-clothing/debt/${id}`);
  return res.data;
};
export const changeEmployeeDebt = async (
  id: string,
  data: ChangeDebtDto
): Promise<EmployeeClothingItem> => {
  const res = await api.patch<EmployeeClothingItem>(
    `/employee-clothing/change-debt/${id}`,
    data
  );
  return res.data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await api.delete(`/employees/delete/${id}`);
};
