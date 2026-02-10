import { api } from "@/lib/api";
import type {
  ChangeSentItemQuantityDto,
  CreateSentItemDto,
  UpdateSentItemDto,
} from "@/types/dto/sent-item.dto";
import type { SentItem, SentItemHistory } from "@/types/sent-item";

// Получить все позиции
export const getAllSentItems = async (): Promise<SentItem[]> => {
  const res = await api.get("/sent-items/all");
  return res.data;
};

// Создать позицию
export const createSentItem = async (
  data: CreateSentItemDto,
): Promise<SentItem> => {
  const res = await api.post("/sent-items/create", data);
  return res.data;
};

// Обновить позицию
export const updateSentItem = async (
  id: string,
  data: UpdateSentItemDto,
): Promise<SentItem> => {
  const res = await api.patch(`/sent-items/update/${id}`, data);
  return res.data;
};

// Удалить позицию
export const deleteSentItem = async (id: string): Promise<void> => {
  await api.delete(`/sent-items/delete/${id}`);
};

// ➕ Пополнение
export const addSentItemQuantity = async (
  id: string,
  data: ChangeSentItemQuantityDto,
): Promise<{ success: true }> => {
  const res = await api.post(`/sent-items/add/${id}`, data);
  return res.data;
};

// ➖ Списание
export const removeSentItemQuantity = async (
  id: string,
  data: ChangeSentItemQuantityDto,
): Promise<{ success: true }> => {
  const res = await api.post(`/sent-items/remove/${id}`, data);
  return res.data;
};

// 📜 История изменений
export const getSentItemHistory = async (
  sentItemId: string,
): Promise<SentItemHistory[]> => {
  const res = await api.get(`/sent-items/history/${sentItemId}`);
  return res.data;
};
