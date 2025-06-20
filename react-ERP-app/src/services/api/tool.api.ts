import { api } from "@/lib/api";
import type {
  CreateToolDto,
  UpdateToolDto,
  TransferToolDto,
  UpdateToolStatusDto,
} from "@/types/dto/tool.dto";
import type { Tool, ToolStatus } from "@/types/tool";

// Получить все инструменты
export const getFilteredTools = async (params: {
  searchQuery: string;
  objectId?: string | null;
  status?: ToolStatus | null;
}) => {
  const res = await api.get("/tools/filter", {
    params: {
      serialNumber: params.searchQuery || undefined,
      objectId: params.objectId || undefined,
      status: params.status || undefined,
    },
  });
  return res.data;
};

// Получить инструмент по id
export const getToolById = async (id: string): Promise<Tool> => {
  const res = await api.get(`/tools/${id}`);
  return res.data;
};

// Создать инструмент
export const createTool = async (data: CreateToolDto): Promise<Tool> => {
  const res = await api.post("/tools/create", data);
  return res.data;
};

// Обновить инструмент
export const updateTool = async (
  id: string,
  data: UpdateToolDto
): Promise<Tool> => {
  const res = await api.put(`/tools/update/${id}`, data);
  return res.data;
};

// Обновить статус инструмента
export const updateToolStatus = async (
  id: string,
  data: UpdateToolStatusDto
): Promise<Tool> => {
  const res = await api.patch(`/tools/status/${id}`, data);
  return res.data;
};

// Передать инструмент
export const transferTool = async (
  id: string,
  data: TransferToolDto
): Promise<{ transferredTool: Tool }> => {
  const res = await api.patch(`/tools/transfer/${id}`, data);
  return res.data;
};

// Подтвердить передачу
export const confirmToolTransfer = async (id: string): Promise<Tool> => {
  const res = await api.patch(`/tools/confirm/${id}`);
  return res.data;
};

// Удалить инструмент
export const deleteTool = async (id: string): Promise<void> => {
  await api.delete(`/tools/delete/${id}`);
};
