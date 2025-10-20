import { api } from "@/lib/api";
import type {
  CreateClothesDto,
  UpdateClothesDto,
  TransferClothesDto,
  WriteOffClothesDto,
  AddClothesDto,
  GiveClothingDto,
  RejectClotheseDto,
  ResendClothesTransferDto,
  CancelClothesTransferDto,
  WirteOffClothesInTransferDto,
} from "@/types/dto/clothes.dto";
import type { Clothes, ClothesType, Seasons } from "@/types/clothes";
import type { TransferRecord } from "@/types/historyRecords";

// Получить список одежды с фильтрами
export const getFilteredClothes = async (params: {
  searchQuery?: string;
  objectId?: string | null;
  season?: Seasons | null;
  type: ClothesType;
}) => {
  const res = await api.get("/clothes/filter", {
    params: {
      type: params.type,
      search: params.searchQuery || undefined, // ✅ исправлено
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

export const rejectClothesTransfer = async (
  id: string,
  data: RejectClotheseDto
) => {
  const res = await api.patch(`/clothes/reject/${id}`, data);
  return res.data;
};

export const resendClothesTransfer = async (
  id: string,
  data: ResendClothesTransferDto
) => {
  const res = await api.post(`/clothes/retransfer/${id}`, data);
  return res.data;
};

export const returnClothesToSource = async (id: string) => {
  const res = await api.post(`/clothes/transfer-return/${id}`);
  return res.data;
};

export const cancelClothesTransfer = async (
  id: string,
  data: CancelClothesTransferDto
) => {
  const res = await api.post(`/clothes/transfer-cancel/${id}`, data);
  return res.data;
};

export const writeOffClothesInTransfer = async (
  id: string,
  data: WirteOffClothesInTransferDto
) => {
  const res = await api.post(`/clothes/transfer-write-off/${id}`, data);
  return res.data;
};

export const requestClothesPhotoByTransferId = async (transferId: string) => {
  const res = await api.post(`/clothes/request-photo-transfer/${transferId}`);
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

export const getClothesHistory = async (
  id: string
): Promise<TransferRecord[]> => {
  const res = await api.get(`/clothes-history/transfers/${id}`);
  return res.data;
};

// ===== CLOTHING SIZES =====

// Получить все размеры одежды
export const getClothingSizes = async (): Promise<
  { id: string; size: string }[]
> => {
  const res = await api.get("/clothes/sizes-clothing");
  return res.data;
};

// Создать новый размер одежды
export const createClothingSize = async (data: { size: string }) => {
  const res = await api.post("/clothes/create-size-clothing", data);
  return res.data;
};

// Удалить размер одежды
export const deleteClothingSize = async (id: string) => {
  const res = await api.delete(`/clothes/remove-size-clothing/${id}`);
  return res.data;
};

// ===== CLOTHING HEIGHTS =====

// Получить все ростовки одежды
export const getClothingHeights = async (): Promise<
  { id: string; height: string }[]
> => {
  const res = await api.get("/clothes/height-clothing");
  return res.data;
};

// Создать новую ростовку одежды
export const createClothingHeight = async (data: { height: string }) => {
  const res = await api.post("/clothes/create-height-clothing", data);
  return res.data;
};

// Удалить ростовку одежды
export const deleteClothingHeight = async (id: string) => {
  const res = await api.delete(`/clothes/remove-height-clothing/${id}`);
  return res.data;
};

// ===== FOOTWEAR SIZES =====

// Получить все размеры обуви
export const getFootwearSizes = async (): Promise<
  { id: string; size: string }[]
> => {
  const res = await api.get("/clothes/sizes-footwear");
  return res.data;
};

// Создать новый размер обуви
export const createFootwearSize = async (data: { size: string }) => {
  const res = await api.post("/clothes/create-size-footwear", data);
  return res.data;
};

// Удалить размер обуви
export const deleteFootwearSize = async (id: string) => {
  const res = await api.delete(`/clothes/remove-size-footwear/${id}`);
  return res.data;
};

// ===== PROVIDERS =====

export const getAllProviders = async (): Promise<
  { id: string; name: string }[]
> => {
  const res = await api.get("/clothes/providers");
  return res.data;
};

export const createProvider = async (data: { name: string }) => {
  const res = await api.post("/clothes/create-provider", data);
  return res.data;
};

export const updateProvider = async (id: string, data: { name: string }) => {
  const res = await api.put(`/clothes/update-provider/${id}`, data);
  return res.data;
};

export const deleteProvider = async (id: string) => {
  await api.delete(`/clothes/remove-provider/${id}`);
};
