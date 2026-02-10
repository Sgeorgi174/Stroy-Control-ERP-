import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import {
  addSentItemQuantity,
  createSentItem,
  deleteSentItem,
  getAllSentItems,
  getSentItemHistory,
  removeSentItemQuantity,
  updateSentItem,
} from "@/services/api/sent-item.api";
import type {
  ChangeSentItemQuantityDto,
  CreateSentItemDto,
  UpdateSentItemDto,
} from "@/types/dto/sent-item.dto";

// Получить все отправленные позиции
export const useSentItems = () => {
  return useQuery({
    queryKey: ["sent-items"],
    queryFn: () => getAllSentItems(),
  });
};

// Создание позиции
export const useCreateSentItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSentItemDto) => createSentItem(data),
    onSuccess: (data) => {
      toast.success(`Позиция «${data.name}» успешно создана`);
      queryClient.invalidateQueries({ queryKey: ["sent-items"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось создать позицию";
      toast.error(message);
    },
  });
};

// Обновление позиции
export const useUpdateSentItem = (sentItemId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSentItemDto) => updateSentItem(sentItemId, data),
    onSuccess: (data) => {
      toast.success(`Позиция «${data.name}» успешно обновлена`);
      queryClient.invalidateQueries({ queryKey: ["sent-items"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось обновить позицию";
      toast.error(message);
    },
  });
};

// Удаление позиции
export const useDeleteSentItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sentItemId: string) => deleteSentItem(sentItemId),
    onSuccess: () => {
      toast.success("Позиция успешно удалена");
      queryClient.invalidateQueries({ queryKey: ["sent-items"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось удалить позицию";
      toast.error(message);
    },
  });
};

// ➕ Пополнение
export const useAddSentItemQuantity = (sentItemId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangeSentItemQuantityDto) =>
      addSentItemQuantity(sentItemId, data),
    onSuccess: () => {
      toast.success("Количество успешно увеличено");
      queryClient.invalidateQueries({ queryKey: ["sent-items"] });
      queryClient.invalidateQueries({
        queryKey: ["sent-item-history", sentItemId],
      });
    },
    onError: (error: AppAxiosError) => {
      const message = error?.response?.data?.message || "Не удалось пополнить";
      toast.error(message);
    },
  });
};

// ➖ Списание
export const useRemoveSentItemQuantity = (sentItemId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangeSentItemQuantityDto) =>
      removeSentItemQuantity(sentItemId, data),
    onSuccess: () => {
      toast.success("Количество успешно списано");
      queryClient.invalidateQueries({ queryKey: ["sent-items"] });
      queryClient.invalidateQueries({
        queryKey: ["sent-item-history", sentItemId],
      });
    },
    onError: (error: AppAxiosError) => {
      const message = error?.response?.data?.message || "Не удалось списать";
      toast.error(message);
    },
  });
};

// 📜 История изменений
export const useSentItemHistory = (sentItemId: string) => {
  return useQuery({
    queryKey: ["sent-item-history", sentItemId],
    queryFn: () => getSentItemHistory(sentItemId),
    enabled: !!sentItemId,
  });
};
