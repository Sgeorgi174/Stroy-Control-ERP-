import { api } from "@/lib/api";
import type {
  EmployeeOvertime,
  EmployeeOvertimeStats,
  EmployeeOvertimeComment,
} from "@/types/overtime";
import type {
  CreateEmployeeOvertimeDto,
  GetOvertimeFilterDto,
  UpdateEmployeeOvertimeDto,
} from "@/types/dto/overtime.dto";

const BASE_URL = "/overtimes";

export const createOvertime = async (
  data: CreateEmployeeOvertimeDto,
): Promise<EmployeeOvertime> => {
  const res = await api.post(`${BASE_URL}/create`, data);
  return res.data;
};

export const getOvertimes = async (
  filters: GetOvertimeFilterDto,
): Promise<EmployeeOvertime[]> => {
  const res = await api.get(`${BASE_URL}/filter`, { params: filters });
  return res.data;
};

export const getOvertimeById = async (
  id: string,
): Promise<EmployeeOvertime> => {
  const res = await api.get(`${BASE_URL}/by-id/${id}`);
  return res.data;
};

export const getEmployeeOvertimeStats = async (
  employeeId: string,
): Promise<EmployeeOvertimeStats> => {
  const res = await api.get(`${BASE_URL}/stats/${employeeId}`);
  return res.data;
};

export const updateOvertime = async (
  id: string,
  data: UpdateEmployeeOvertimeDto,
): Promise<EmployeeOvertime> => {
  const res = await api.put(`${BASE_URL}/update/${id}`, data);
  return res.data;
};

export const approveOvertime = async (
  id: string,
): Promise<EmployeeOvertime> => {
  const res = await api.patch(`${BASE_URL}/approve/${id}`);
  return res.data;
};

export const processOvertime = async (
  id: string,
): Promise<EmployeeOvertime> => {
  const res = await api.patch(`${BASE_URL}/process/${id}`);
  return res.data;
};

export const rejectOvertime = async (
  id: string,
  reason?: string,
): Promise<EmployeeOvertime> => {
  const res = await api.patch(`${BASE_URL}/reject/${id}`, { reason });
  return res.data;
};

export const cancelOvertime = async (id: string): Promise<EmployeeOvertime> => {
  const res = await api.patch(`${BASE_URL}/cancel/${id}`);
  return res.data;
};

// --- Комментарии ---

export const addOvertimeComment = async (
  overtimeId: string,
  text: string,
): Promise<EmployeeOvertimeComment> => {
  const res = await api.post(`${BASE_URL}/${overtimeId}/comments`, { text });
  return res.data;
};

export const getOvertimeComments = async (
  overtimeId: string,
): Promise<EmployeeOvertimeComment[]> => {
  const res = await api.get(`${BASE_URL}/${overtimeId}/comments`);
  return res.data;
};

export const deleteOvertimeComment = async (
  commentId: string,
): Promise<void> => {
  await api.delete(`${BASE_URL}/comments/${commentId}`);
};
