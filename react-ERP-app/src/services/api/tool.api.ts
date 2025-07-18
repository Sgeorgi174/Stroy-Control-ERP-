import { api } from "@/lib/api";
import type {
  CreateToolDto,
  UpdateToolDto,
  TransferToolDto,
  UpdateToolStatusDto,
  RejectToolDto,
  ResendToolTransferDto,
  WirteOffToolInTransferDto,
  CancelToolTransferDto,
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
      searchQuery: params.searchQuery || undefined,
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
export const confirmToolTransfer = async (id: string) => {
  const res = await api.patch(`/tools/confirm/${id}`);
  return res.data;
};

export const rejectToolTransfer = async (id: string, data: RejectToolDto) => {
  const res = await api.patch(`/tools/reject/${id}`, data);
  return res.data;
};

export const resendToolTransfer = async (
  id: string,
  data: ResendToolTransferDto
) => {
  const res = await api.post(`/tools/retransfer/${id}`, data);
  return res.data;
};

export const returnToolToSource = async (id: string) => {
  const res = await api.post(`/tools/transfer-return/${id}`);
  return res.data;
};

export const cancelToolTransfer = async (
  id: string,
  data: CancelToolTransferDto
) => {
  const res = await api.post(`/tools/transfer-cancel/${id}`, data);
  return res.data;
};

export const writeOffToolInTransfer = async (
  id: string,
  data: WirteOffToolInTransferDto
) => {
  const res = await api.post(`/tools/transfer-write-off/${id}`, data);
  return res.data;
};

export const deleteTool = async (id: string): Promise<void> => {
  await api.delete(`/tools/delete/${id}`);
};

export const getToolHistory = async (id: string): Promise<void> => {
  const res = await api.get(`/tool-history/transfers/${id}`);
  return res.data;
};

export const requestToolPhotoByTransferId = async (transferId: string) => {
  const res = await api.post(`/tools/request-photo-transfer/${transferId}`);
  return res.data;
};

export const getToolStatusChangesHistory = async (
  id: string
): Promise<void> => {
  const res = await api.get(`/tool-history/statuses/${id}`);
  return res.data;
};
