import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import type {
  GetOvertimeFilterDto,
  UpdateEmployeeOvertimeDto,
  CreateEmployeeOvertimeDto,
} from "@/types/dto/overtime.dto";
import {
  addOvertimeComment,
  approveOvertime,
  cancelOvertime,
  createOvertime,
  deleteOvertimeComment,
  getEmployeeOvertimeStats,
  getOvertimes,
  getOvertimeById,
  getOvertimeComments,
  processOvertime,
  rejectOvertime,
  updateOvertime,
} from "@/services/api/overtime.api";

export const useOvertimes = (filters: GetOvertimeFilterDto = {}) => {
  return useQuery({
    queryKey: ["overtimes", filters],
    queryFn: () => getOvertimes(filters),
  });
};

export const useOvertime = (id: string | undefined) => {
  return useQuery({
    queryKey: ["overtime", id],
    queryFn: () => getOvertimeById(id!),
    enabled: !!id,
  });
};

export const useEmployeeOvertimeStats = (employeeId: string | undefined) => {
  return useQuery({
    queryKey: ["overtime-stats", employeeId],
    queryFn: () => getEmployeeOvertimeStats(employeeId!),
    enabled: !!employeeId,
  });
};

export const useCreateOvertime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEmployeeOvertimeDto) => createOvertime(data),
    onSuccess: () => {
      toast.success("Доп. часы успешно зафиксированы");
      queryClient.invalidateQueries({ queryKey: ["overtimes"] });
    },
    onError: (error: AppAxiosError) => {
      toast.error(error?.response?.data?.message || "Ошибка при создании");
    },
  });
};

export const useUpdateOvertime = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateEmployeeOvertimeDto) => updateOvertime(id, data),
    onSuccess: () => {
      toast.success("Данные обновлены");
      queryClient.invalidateQueries({ queryKey: ["overtimes"] });
      queryClient.invalidateQueries({ queryKey: ["overtime", id] });
    },
    onError: (error: AppAxiosError) => {
      toast.error(error?.response?.data?.message || "Не удалось обновить");
    },
  });
};

export const useApproveOvertime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveOvertime(id),
    onSuccess: (_, id) => {
      toast.success("Часы согласованы");
      queryClient.invalidateQueries({ queryKey: ["overtimes"] });
      queryClient.invalidateQueries({ queryKey: ["overtime", id] });
      queryClient.invalidateQueries({ queryKey: ["overtime-comments", id] });
    },
  });
};

export const useRejectOvertime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      rejectOvertime(id, reason),
    onSuccess: (_, { id }) => {
      toast.success("Заявка отклонена");
      queryClient.invalidateQueries({ queryKey: ["overtimes"] });
      queryClient.invalidateQueries({ queryKey: ["overtime", id] });
      queryClient.invalidateQueries({ queryKey: ["overtime-comments", id] });
    },
  });
};

export const useProcessOvertime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => processOvertime(id),
    onSuccess: (_, id) => {
      toast.success("Часы успешно проведены");
      queryClient.invalidateQueries({ queryKey: ["overtimes"] });
      queryClient.invalidateQueries({ queryKey: ["overtime", id] });
      queryClient.invalidateQueries({ queryKey: ["overtime-stats"] });
      queryClient.invalidateQueries({ queryKey: ["overtime-comments", id] });
    },
  });
};

export const useCancelOvertime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelOvertime(id),
    onSuccess: (_, id) => {
      toast.success("Заявка отменена");
      queryClient.invalidateQueries({ queryKey: ["overtimes"] });
      queryClient.invalidateQueries({ queryKey: ["overtime", id] });
      queryClient.invalidateQueries({ queryKey: ["overtime-comments", id] });
    },
    onError: (error: AppAxiosError) => {
      toast.error(error?.response?.data?.message || "Не удалось отменить");
    },
  });
};

// Комментарии
export const useOvertimeComments = (overtimeId: string) => {
  return useQuery({
    queryKey: ["overtime-comments", overtimeId],
    queryFn: () => getOvertimeComments(overtimeId),
    enabled: !!overtimeId,
  });
};

export const useAddOvertimeComment = (overtimeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => addOvertimeComment(overtimeId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["overtime-comments", overtimeId],
      });
    },
  });
};

export const useDeleteOvertimeComment = (overtimeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteOvertimeComment(commentId),
    onSuccess: () => {
      toast.success("Комментарий удален");
      queryClient.invalidateQueries({
        queryKey: ["overtime-comments", overtimeId],
      });
    },
    onError: (error: AppAxiosError) => {
      toast.error(error?.response?.data?.message || "Ошибка при удалении");
    },
  });
};
