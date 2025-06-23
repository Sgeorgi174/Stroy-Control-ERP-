import { api } from "@/lib/api";
import type {
  CreateTabletDto,
  TransferTabletDto,
  UpdateTabletDto,
  UpdateTabletStatusDto,
} from "@/types/dto/tablet.dto";
import type { Tablet, TabletStatus } from "@/types/tablet";

// Получить все инструменты
export const getFilteredTablets = async (params: {
  searchQuery: string;
  status?: TabletStatus | null;
}) => {
  const res = await api.get("/tablets/filter", {
    params: {
      searchQuery: params.searchQuery || undefined,
      status: params.status || undefined,
    },
  });
  return res.data;
};

// Получить инструмент по id
export const getTabletById = async (id: string): Promise<Tablet> => {
  const res = await api.get(`/tablets/${id}`);
  return res.data;
};

// Создать инструмент
export const createTablet = async (data: CreateTabletDto): Promise<Tablet> => {
  const res = await api.post("/tablets/create", data);
  return res.data;
};

// Обновить инструмент
export const updateTablet = async (
  id: string,
  data: UpdateTabletDto
): Promise<Tablet> => {
  const res = await api.put(`/tablets/update/${id}`, data);
  return res.data;
};

// Обновить статус инструмента
export const updateTabletStatus = async (
  id: string,
  data: UpdateTabletStatusDto
): Promise<Tablet> => {
  const res = await api.patch(`/tablets/status/${id}`, data);
  return res.data;
};

// Передать инструмент
export const transferTablet = async (
  id: string,
  data: TransferTabletDto
): Promise<{ transferredTool: Tablet }> => {
  const res = await api.patch(`/tablets/transfer/${id}`, data);
  return res.data;
};

export const releaseTablet = async (id: string) => {
  const res = await api.patch(`/tablets/release/${id}`);
  return res.data;
};

// Удалить инструмент
export const deleteTablet = async (id: string): Promise<void> => {
  await api.delete(`/tablets/delete/${id}`);
};
