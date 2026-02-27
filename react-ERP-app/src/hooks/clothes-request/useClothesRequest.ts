import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  createClothesRequest,
  getAllClothesRequests,
  updateClothesRequest,
  deleteClothesRequest,
  deleteComment,
  updateComment,
  addComment,
  getCommentsByRequest,
  updateClothesRequestStatus,
  getOneClothesRequest,
  transferClothesToStorage,
} from "@/services/api/clothes-request.api";
import type {
  CreateClothesRequestDto,
  UpdateClothesRequestDto,
  UpdateRequestStatusDto,
} from "@/types/dto/clothes-request.dto";
import type { AppAxiosError } from "@/types/error-response";
import type { ClothesRequest, RequestComment } from "@/types/clothes-request";

// 🔹 Получить все заявки
export const useClothesRequests = () => {
  return useQuery<ClothesRequest[]>({
    queryKey: ["clothes-requests"],
    queryFn: () => getAllClothesRequests(),
  });
};

// 🔹 Создать заявку
export const useCreateClothesRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClothesRequestDto) => createClothesRequest(data),

    onSuccess: () => {
      toast.success("Заявка успешно создана");
      queryClient.invalidateQueries({ queryKey: ["clothes-requests"] });
    },

    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось создать заявку";
      toast.error(message);
    },
  });
};

// 🔹 Обновить заявку
export const useUpdateClothesRequest = (requestId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateClothesRequestDto) =>
      updateClothesRequest(requestId, data),

    onSuccess: () => {
      toast.success("Заявка успешно обновлена");
      queryClient.invalidateQueries({ queryKey: ["clothes-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["clothes-request", requestId],
      });
    },

    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось обновить заявку";
      toast.error(message);
    },
  });
};

// 🔹 Удалить заявку
export const useDeleteClothesRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => deleteClothesRequest(requestId),

    onSuccess: () => {
      toast.success("Заявка успешно удалена");
      queryClient.invalidateQueries({ queryKey: ["clothes-requests"] });
    },

    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось удалить заявку";
      toast.error(message);
    },
  });
};

// 🔹 Получить комментарии заявки
export const useCommentsByRequest = (
  requestId: string,
  enabled: boolean = true,
) => {
  return useQuery<RequestComment[]>({
    queryKey: ["request-comments", requestId],
    queryFn: () => getCommentsByRequest(requestId),
    // Поллинг 10 секунд
    refetchInterval: enabled ? 10000 : false,
    // Запрос идет только если Popover открыт
    enabled: enabled,
    // Обновлять при наведении фокуса на окно (по желанию)
    refetchOnWindowFocus: true,
  });
};

// 🔹 Добавить комментарий
export const useAddComment = (requestId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => addComment(requestId, text),
    onSuccess: () => {
      toast.success("Комментарий добавлен");
      queryClient.invalidateQueries({
        queryKey: ["request-comments", requestId],
      });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось добавить комментарий";
      toast.error(message);
    },
  });
};

// 🔹 Редактировать комментарий
export const useUpdateComment = (requestId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, text }: { commentId: string; text: string }) =>
      updateComment(commentId, text),
    onSuccess: () => {
      toast.success("Комментарий обновлен");
      queryClient.invalidateQueries({
        queryKey: ["request-comments", requestId],
      });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось обновить комментарий";
      toast.error(message);
    },
  });
};

// 🔹 Удалить комментарий
export const useDeleteComment = (requestId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      toast.success("Комментарий удален");
      queryClient.invalidateQueries({
        queryKey: ["request-comments", requestId],
      });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось удалить комментарий";
      toast.error(message);
    },
  });
};

export const useUpdateClothesRequestStatus = (requestId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRequestStatusDto) =>
      updateClothesRequestStatus(requestId, data),

    onSuccess: () => {
      toast.success(`Статус изменен`);

      // Обновляем список (чтобы в таблице статус сменился)
      queryClient.invalidateQueries({ queryKey: ["clothes-requests"] });

      // Обновляем детальную запись (чтобы в открытом диалоге данные обновились)
      queryClient.invalidateQueries({
        queryKey: ["clothes-request", requestId],
      });

      // Обновляем комменты (там системный лог)
      queryClient.invalidateQueries({
        queryKey: ["request-comments", requestId],
      });
    },
    // ... onError без изменений
  });
};

// 🔹 Хук для получения одной заявки
export const useClothesRequest = (requestId: string | undefined) => {
  return useQuery<ClothesRequest>({
    queryKey: ["clothes-request", requestId],
    queryFn: () => getOneClothesRequest(requestId!),
    enabled: !!requestId, // Не делать запрос, если id пустой
  });
};

export const useTransferToStorage = (requestId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      objectId: string;
      items: { requestClothesId: string; quantity: number }[];
    }) => transferClothesToStorage(requestId, data),

    onSuccess: (res) => {
      if (res.completed) {
        toast.success("Все позиции перемещены, заявка закрыта");
      } else {
        toast.success("Позиции успешно перемещены на склад");
      }

      // Обновляем список заявок
      queryClient.invalidateQueries({ queryKey: ["clothes-requests"] });

      // Обновляем детальную информацию (обновятся счетчики transferredQuantity)
      queryClient.invalidateQueries({
        queryKey: ["clothes-request", requestId],
      });

      // Обновляем комментарии (там появится системный лог о приходе)
      queryClient.invalidateQueries({
        queryKey: ["request-comments", requestId],
      });

      // Если у вас есть отдельный запрос на остатки склада, его тоже стоит обновить
      queryClient.invalidateQueries({ queryKey: ["clothes"] });
    },

    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось выполнить перемещение";
      toast.error(message);
    },
  });
};
