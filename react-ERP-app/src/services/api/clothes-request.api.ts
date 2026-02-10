import { api } from "@/lib/api";
import type { ClothesRequest } from "@/types/clothes-request";
import type {
  CreateClothesRequestDto,
  UpdateClothesRequestDto,
} from "@/types/dto/clothes-request.dto";

// 🔹 Создать заявку
export const createClothesRequest = async (
  data: CreateClothesRequestDto,
): Promise<ClothesRequest> => {
  const res = await api.post("/clothes-request/create", data);
  return res.data;
};

// 🔹 Получить все доступные заявки
export const getAllClothesRequests = async (): Promise<ClothesRequest[]> => {
  const res = await api.get("/clothes-request/all");
  return res.data;
};

// 🔹 Обновить заявку
export const updateClothesRequest = async (
  id: string,
  data: UpdateClothesRequestDto,
): Promise<ClothesRequest> => {
  const res = await api.patch(`/clothes-request/update/${id}`, data);
  return res.data;
};

// 🔹 Удалить заявку
export const deleteClothesRequest = async (id: string): Promise<void> => {
  await api.delete(`/clothes-request/delete/${id}`);
};
