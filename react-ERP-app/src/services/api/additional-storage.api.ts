import { api } from "@/lib/api";
import type { AdditionalStorage } from "@/types/additional-storage";
import type {
  CreateAdditionalStorageDto,
  UpdateAdditionalStorageDto,
} from "@/types/dto/additional-storage.dto";

// Получить все склады
export const getAllAdditionalStorages = async (): Promise<
  AdditionalStorage[]
> => {
  const res = await api.get("/additional-storage/all");
  return res.data;
};

// Создать склад
export const createAdditionalStorage = async (
  data: CreateAdditionalStorageDto,
): Promise<AdditionalStorage> => {
  const res = await api.post("/additional-storage/create", data);
  return res.data;
};

// Обновить склад
export const updateAdditionalStorage = async (
  id: string,
  data: UpdateAdditionalStorageDto,
): Promise<AdditionalStorage> => {
  const res = await api.patch(`/additional-storage/${id}`, data);
  return res.data;
};

// Удалить склад
export const deleteAdditionalStorage = async (id: string): Promise<void> => {
  await api.delete(`/additional-storage/${id}`);
};
