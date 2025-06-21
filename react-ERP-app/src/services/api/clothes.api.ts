import { api } from "@/lib/api";
import type {
  CreateClothesDto,
  UpdateClothesDto,
  TransferClothesDto,
  WriteOffClothesDto,
  AddClothesDto,
  GiveClothingDto,
} from "@/types/dto/clothes.dto";
import type { Clothes, ClothesType, Seasons } from "@/types/clothes";

// Получить список одежды с фильтрами
export const getFilteredClothes = async (params: {
  searchQuery: string;
  objectId?: string | null;
  season?: Seasons | null;
  type: ClothesType;
}) => {
  const res = await api.get("/clothes/filter", {
    params: {
      type: params.type,
      size: params.searchQuery || undefined,
      objectId: params.objectId || undefined,
      season: params.season || undefined,
    },
  });
  return res.data;
};

// Получить одежду по id
export const getClothesById = async (id: string): Promise<Clothes> => {
  const res = await api.get(`/clothes/${id}`);
  return res.data;
};

// Создать одежду
export const createClothes = async (
  data: CreateClothesDto
): Promise<Clothes> => {
  const res = await api.post("/clothes/create", data);
  return res.data;
};

// Обновить одежду
export const updateClothes = async (
  id: string,
  data: UpdateClothesDto
): Promise<Clothes> => {
  const res = await api.put(`/clothes/update/${id}`, data);
  return res.data;
};

// Передать одежду сотруднику (создать запись выдачи)
export const transferClothes = async (
  id: string,
  data: TransferClothesDto
): Promise<{ transferredClothes: Clothes }> => {
  const res = await api.patch(`/clothes/transfer/${id}`, data);
  return res.data;
};

// Подтвердить передачу одежды
export const confirmClothesTransfer = async (
  id: string,
  quantity: number
): Promise<Clothes> => {
  const res = await api.patch(`/clothes/confirm/${id}`, { quantity });
  return res.data;
};

// Списать одежду (write off)
export const writeOffClothes = async (
  id: string,
  data: WriteOffClothesDto
): Promise<Clothes> => {
  const res = await api.patch(`/clothes/write-off/${id}`, data);
  return res.data;
};

export const addClothes = async (
  id: string,
  data: AddClothesDto
): Promise<Clothes> => {
  const res = await api.patch(`/clothes/add/${id}`, data);
  return res.data;
};

export const giveClothes = async (
  id: string,
  data: GiveClothingDto
): Promise<Clothes> => {
  const res = await api.patch(`/clothes/give/${id}`, data);
  return res.data;
};

// Удалить одежду
export const deleteClothes = async (id: string): Promise<void> => {
  await api.delete(`/clothes/delete/${id}`);
};
