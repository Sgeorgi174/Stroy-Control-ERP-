import { api } from "@/lib/api";
import type {
  CreateShiftDto,
  GetShiftsFilterDto,
  UpdateShiftDto,
} from "@/types/dto/shift.dto";
import type { Shift } from "@/types/shift";
// Создать смену
export const createShift = async (data: CreateShiftDto): Promise<Shift> => {
  const res = await api.post("/shift/create", data);
  return res.data;
};

// Обновить смену
export const updateShift = async (
  id: string,
  data: UpdateShiftDto
): Promise<Shift> => {
  const res = await api.put(`/shift/update/${id}`, data);
  return res.data;
};

// Получить смену по объекту
export const getShiftsByObject = async (objectId: string): Promise<Shift[]> => {
  const res = await api.get(`/shift/get-by-object/${objectId}`);
  return res.data;
};

// Получить смены по фильтрам (дата, объект, сотрудники)
export const getShiftsWithFilters = async (
  filters: GetShiftsFilterDto
): Promise<Shift[]> => {
  const res = await api.get("/shift/filter", { params: filters });
  return res.data;
};
