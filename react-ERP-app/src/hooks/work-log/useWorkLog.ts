import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  createWorkLog,
  getWorkLogArchive,
  getCalendarHighlights,
  deleteWorkLog,
  updateWorkLog,
} from "@/services/api/work-log.api";
import type {
  CreateWorkLogDto,
  GetWorkLogFilterDto,
  UpdateWorkLogDto,
} from "@/types/dto/work-log.dto";
import type { AppAxiosError } from "@/types/error-response";
import type { WorkLog } from "@/types/work-log";

// 🔹 Получить архив журналов за месяц
export const useWorkLogArchive = (
  objectId: string,
  filters: GetWorkLogFilterDto,
) => {
  return useQuery<WorkLog[]>({
    queryKey: ["work-logs", objectId, filters.year, filters.month],
    queryFn: () => getWorkLogArchive(objectId, filters),
    enabled: !!objectId,
  });
};

// 🔹 Получить подсветку дат для календаря
export const useWorkLogCalendar = (
  objectId: string,
  filters: GetWorkLogFilterDto,
) => {
  return useQuery<number[]>({
    queryKey: ["work-log-calendar", objectId, filters.year, filters.month],
    queryFn: () => getCalendarHighlights(objectId, filters),
    enabled: !!objectId,
  });
};

// 🔹 Создать запись
export const useCreateWorkLog = (objectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkLogDto) => createWorkLog(data),
    onSuccess: () => {
      toast.success("Запись в журнале сохранена");
      // Инвалидируем и список, и календарь
      queryClient.invalidateQueries({ queryKey: ["work-logs", objectId] });
      queryClient.invalidateQueries({
        queryKey: ["work-log-calendar", objectId],
      });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось сохранить запись";
      toast.error(message);
    },
  });
};

// 🔹 Обновить запись
export const useUpdateWorkLog = (objectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkLogDto }) =>
      updateWorkLog(id, data),

    onSuccess: () => {
      toast.success("Запись обновлена");

      queryClient.invalidateQueries({ queryKey: ["work-logs", objectId] });
      queryClient.invalidateQueries({
        queryKey: ["work-log-calendar", objectId],
      });
    },

    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось обновить запись";

      toast.error(message);
    },
  });
};

// 🔹 Удалить запись
export const useDeleteWorkLog = (objectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWorkLog(id),
    onSuccess: () => {
      toast.success("Запись удалена");
      queryClient.invalidateQueries({ queryKey: ["work-logs", objectId] });
      queryClient.invalidateQueries({
        queryKey: ["work-log-calendar", objectId],
      });
    },
    onError: (error: AppAxiosError) => {
      console.log(error);

      toast.error("Ошибка при удалении");
    },
  });
};
