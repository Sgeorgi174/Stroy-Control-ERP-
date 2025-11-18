import { api } from "@/lib/api";
import type {
  CreateShiftTemplateDto,
  UpdateShiftTemplateDto,
} from "@/types/dto/shift.dto";
import type { ShiftTemplate } from "@/types/shift";

// Создать шаблон смены
export const createShiftTemplate = async (
  data: CreateShiftTemplateDto
): Promise<ShiftTemplate> => {
  const res = await api.post("/shift-template/create", data);
  return res.data;
};

// Получить шаблоны смен по объекту
export const getShiftTemplatesByObject = async (
  objectId: string
): Promise<ShiftTemplate[]> => {
  const res = await api.get(`/shift-template/get-by-object/${objectId}`);
  return res.data;
};

// Обновить шаблон смены
export const updateShiftTemplate = async (
  id: string,
  data: UpdateShiftTemplateDto
): Promise<ShiftTemplate> => {
  const res = await api.put(`/shift-template/update/${id}`, data);
  return res.data;
};

// Удалить шаблон смены
export const deleteShiftTemplate = async (
  id: string
): Promise<{ success: boolean }> => {
  const res = await api.delete(`/shift-template/delete/${id}`);
  return res.data;
};
