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
  AddToolBagItemDto,
  RemoveToolBagItemDto,
  AddToolCommentDto,
  AddQuantityTool,
  WriteOffQuantityTool,
} from "@/types/dto/tool.dto";
import type { Tool, ToolStatus } from "@/types/tool";

// Получить все инструменты
export const getFilteredTools = async (params: {
  searchQuery: string;
  objectId?: string | null;
  status?: ToolStatus | null;
  isBulk: boolean;
}) => {
  const res = await api.get("/tools/filter", {
    params: {
      searchQuery: params.searchQuery || undefined,
      objectId: params.objectId || undefined,
      status: params.status || undefined,
      isBulk: params.isBulk,
    },
  });
  return res.data;
};

// Получить инструмент по id
export const getToolById = async (id: string): Promise<Tool> => {
  const res = await api.get(`/tools/by-id/${id}`);
  return res.data;
};

// Создать инструмент
export const createTool = async (data: CreateToolDto): Promise<Tool> => {
  const res = await api.post("/tools/create", data);
  return res.data;
};

export const addQuantityTool = async (
  id: string,
  data: AddQuantityTool
): Promise<Tool> => {
  const res = await api.patch(`/tools/add/${id}`, data);
  return res.data;
};

export const writeOffQuantityTool = async (
  id: string,
  data: WriteOffQuantityTool
): Promise<Tool> => {
  const res = await api.patch(`/tools/write-off/${id}`, data);
  return res.data;
};

export const createToolBag = async (data: CreateToolDto): Promise<Tool> => {
  const res = await api.post("/tools/create-bag", data);
  return res.data;
};

export const addToolBagItem = async (
  id: string,
  data: AddToolBagItemDto
): Promise<Tool> => {
  const res = await api.put(`/tools/add-bag-item/${id}`, data);
  return res.data;
};

export const removeToolBagItem = async (
  id: string,
  data: RemoveToolBagItemDto
): Promise<Tool> => {
  const res = await api.put(`/tools/remove-bag-item/${id}`, data);
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

export const addToolComment = async (
  id: string,
  data: AddToolCommentDto
): Promise<Tool> => {
  const res = await api.put(`/tools/add-comment/${id}`, data);
  return res.data;
};

export const updateToolComment = async (
  id: string,
  data: AddToolCommentDto
): Promise<Tool> => {
  const res = await api.put(`/tools/update-comment/${id}`, data);
  return res.data;
};

export const deleteToolComment = async (id: string): Promise<Tool> => {
  const res = await api.put(`/tools/delete-comment/${id}`);
  return res.data;
};
