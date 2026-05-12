import { api } from "@/lib/api";
import type {
  EmployeePenalty,
  EmployeePenaltyStats,
  RequestPenaltyComment,
} from "@/types/penalty";
import type {
  CreateEmployeePenaltyDto,
  GetPenaltyFilterDto,
  UpdateEmployeePenaltyDto,
} from "@/types/dto/penalty.dto";

export const createPenalty = async (
  data: CreateEmployeePenaltyDto,
): Promise<EmployeePenalty> => {
  const res = await api.post("/penalties/create", data);
  return res.data;
};

export const getPenalties = async (
  filters: GetPenaltyFilterDto,
): Promise<EmployeePenalty[]> => {
  const res = await api.get("/penalties/filter", { params: filters });
  return res.data;
};

export const getPenaltyById = async (id: string): Promise<EmployeePenalty> => {
  const res = await api.get(`/penalties/by-id/${id}`);
  return res.data;
};

export const getEmployeePenaltyStats = async (
  employeeId: string,
): Promise<EmployeePenaltyStats> => {
  const res = await api.get(`/penalties/stats/${employeeId}`);
  return res.data;
};

export const updatePenalty = async (
  id: string,
  data: UpdateEmployeePenaltyDto,
): Promise<EmployeePenalty> => {
  const res = await api.put(`/penalties/update/${id}`, data);
  return res.data;
};

export const approvePenalty = async (id: string): Promise<EmployeePenalty> => {
  const res = await api.patch(`/penalties/approve/${id}`);
  return res.data;
};

export const processPenalty = async (id: string): Promise<EmployeePenalty> => {
  const res = await api.patch(`/penalties/process/${id}`);
  return res.data;
};

export const rejectPenalty = async (
  id: string,
  reason?: string,
): Promise<EmployeePenalty> => {
  const res = await api.patch(`/penalties/reject/${id}`, { reason });
  return res.data;
};

export const cancelPenalty = async (id: string): Promise<EmployeePenalty> => {
  const res = await api.patch(`/penalties/cancel/${id}`);
  return res.data;
};

// --- Комментарии ---

export const addPenaltyComment = async (
  penaltyId: string,
  text: string,
): Promise<RequestPenaltyComment> => {
  const res = await api.post(`/penalties/${penaltyId}/comments`, { text });
  return res.data;
};

export const deletePenaltyComment = async (
  commentId: string,
): Promise<void> => {
  await api.delete(`/penalties/comments/${commentId}`);
};

export const getPenaltyComments = async (
  penaltyId: string,
): Promise<RequestPenaltyComment[]> => {
  const res = await api.get(`/penalties/${penaltyId}/comments`);
  return res.data;
};
