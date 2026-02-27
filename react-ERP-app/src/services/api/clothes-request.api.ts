import { api } from "@/lib/api";
import type { ClothesRequest, RequestComment } from "@/types/clothes-request";
import type {
  CreateClothesRequestDto,
  UpdateClothesRequestDto,
  UpdateRequestStatusDto,
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

export const getCommentsByRequest = async (
  requestId: string,
): Promise<RequestComment[]> => {
  const res = await api.get(`/clothes-request/comments/${requestId}`);
  return res.data;
};

// 🔹 Добавить комментарий
export const addComment = async (
  requestId: string,
  text: string,
): Promise<RequestComment> => {
  const res = await api.post(`/clothes-request/comments/${requestId}`, {
    text,
  });
  return res.data;
};

// 🔹 Редактировать комментарий
export const updateComment = async (
  commentId: string,
  text: string,
): Promise<RequestComment> => {
  const res = await api.patch(`/clothes-request/comments/${commentId}`, {
    text,
  });
  return res.data;
};

// 🔹 Удалить комментарий
export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete(`/clothes-request/comments/${commentId}`);
};

export const updateClothesRequestStatus = async (
  id: string,
  data: UpdateRequestStatusDto,
): Promise<ClothesRequest> => {
  const res = await api.patch(`/clothes-request/${id}/status`, data);
  return res.data;
};

// 🔹 Получить одну заявку по ID
export const getOneClothesRequest = async (
  id: string,
): Promise<ClothesRequest> => {
  const res = await api.get(`/clothes-request/get/${id}`);
  return res.data;
};

export const transferClothesToStorage = async (
  requestId: string,
  data: {
    objectId: string;
    items: { requestClothesId: string; quantity: number }[];
  },
): Promise<{ success: boolean; completed: boolean }> => {
  const res = await api.post(`/clothes-request/transfer/${requestId}`, data);
  return res.data;
};
