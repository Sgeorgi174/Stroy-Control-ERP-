import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import type {
  GetPenaltyFilterDto,
  UpdateEmployeePenaltyDto,
  CreateEmployeePenaltyDto,
} from "@/types/dto/penalty.dto";
import {
  addPenaltyComment,
  approvePenalty,
  cancelPenalty,
  createPenalty,
  deletePenaltyComment,
  getEmployeePenaltyStats,
  getPenalties,
  getPenaltyById,
  getPenaltyComments,
  processPenalty,
  rejectPenalty,
  updatePenalty,
} from "@/services/api/penalty.api";

// Получить список штрафов с фильтрами
export const usePenalties = (filters: GetPenaltyFilterDto = {}) => {
  return useQuery({
    queryKey: ["penalties", filters],
    queryFn: () => getPenalties(filters),
  });
};

// Получить один штраф
export const usePenalty = (id: string | undefined) => {
  return useQuery({
    queryKey: ["penalty", id],
    queryFn: () => getPenaltyById(id!),
    enabled: !!id,
  });
};

// Статистика сотрудника
export const useEmployeePenaltyStats = (employeeId: string | undefined) => {
  return useQuery({
    queryKey: ["penalty-stats", employeeId],
    queryFn: () => getEmployeePenaltyStats(employeeId!),
    enabled: !!employeeId,
  });
};

// Создать штраф
export const useCreatePenalty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEmployeePenaltyDto) => createPenalty(data),
    onSuccess: () => {
      toast.success("Штраф успешно зафиксирован");
      queryClient.invalidateQueries({ queryKey: ["penalties"] });
    },
    onError: (error: AppAxiosError) => {
      toast.error(
        error?.response?.data?.message || "Ошибка при создании штрафа",
      );
    },
  });
};

// Обновить штраф
export const useUpdatePenalty = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateEmployeePenaltyDto) => updatePenalty(id, data),
    onSuccess: () => {
      toast.success("Данные штрафа обновлены");
      queryClient.invalidateQueries({ queryKey: ["penalties"] });
      queryClient.invalidateQueries({ queryKey: ["penalty", id] });
    },
    onError: (error: AppAxiosError) => {
      toast.error(error?.response?.data?.message || "Не удалось обновить");
    },
  });
};

// Согласовать (Approve)
export const useApprovePenalty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approvePenalty(id),
    onSuccess: (_, id) => {
      toast.success("Штраф согласован");
      queryClient.invalidateQueries({ queryKey: ["penalties"] });
      queryClient.invalidateQueries({ queryKey: ["penalty", id] });
      // Обновляем комментарии, так как появился системный коммент о согласовании
      queryClient.invalidateQueries({ queryKey: ["penalty-comments", id] });
    },
  });
};

// Провести бухгалтером (Process)
export const useProcessPenalty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => processPenalty(id),
    onSuccess: (_, id) => {
      toast.success("Штраф успешно проведен");
      queryClient.invalidateQueries({ queryKey: ["penalties"] });
      queryClient.invalidateQueries({ queryKey: ["penalty", id] });
      queryClient.invalidateQueries({ queryKey: ["penalty-stats"] });
      queryClient.invalidateQueries({ queryKey: ["penalty-comments", id] });
    },
  });
};

// Отклонить (Reject)
export const useRejectPenalty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      rejectPenalty(id, reason),
    onSuccess: (_, { id }) => {
      toast.success("Штраф отклонен");
      queryClient.invalidateQueries({ queryKey: ["penalties"] });
      queryClient.invalidateQueries({ queryKey: ["penalty", id] });
      queryClient.invalidateQueries({ queryKey: ["penalty-comments", id] });
    },
    onError: (error: AppAxiosError) => {
      toast.error(error?.response?.data?.message || "Ошибка при отклонении");
    },
  });
};

export const useCancelPenalty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelPenalty(id),
    onSuccess: (_, id) => {
      toast.success("Заявка отменена");
      queryClient.invalidateQueries({ queryKey: ["penalties"] });
      queryClient.invalidateQueries({ queryKey: ["penalty", id] });
      queryClient.invalidateQueries({ queryKey: ["penalty-comments", id] });
    },
    onError: (error: AppAxiosError) => {
      toast.error(error?.response?.data?.message || "Не удалось отменить");
    },
  });
};

// Получить комментарии
export const usePenaltyComments = (penaltyId: string) => {
  return useQuery({
    queryKey: ["penalty-comments", penaltyId],
    queryFn: () => getPenaltyComments(penaltyId),
    enabled: !!penaltyId,
  });
};

// Добавить комментарий
export const useAddPenaltyComment = (penaltyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    // Принимаем текст сообщения
    mutationFn: (text: string) => addPenaltyComment(penaltyId, text),
    onSuccess: () => {
      // Инвалидируем кэш, чтобы список обновился
      queryClient.invalidateQueries({
        queryKey: ["penalty-comments", penaltyId],
      });
    },
    onError: (error: AppAxiosError) => {
      toast.error(error?.response?.data?.message || "Ошибка отправки");
    },
  });
};

// Удалить комментарий
export const useDeletePenaltyComment = (penaltyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deletePenaltyComment(commentId),
    onSuccess: () => {
      toast.success("Комментарий удален");
      queryClient.invalidateQueries({
        queryKey: ["penalty-comments", penaltyId],
      });
    },
    onError: (error: AppAxiosError) => {
      toast.error(error?.response?.data?.message || "Ошибка при удалении");
    },
  });
};
