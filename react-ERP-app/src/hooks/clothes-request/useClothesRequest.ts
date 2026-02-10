import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  createClothesRequest,
  getAllClothesRequests,
  updateClothesRequest,
  deleteClothesRequest,
} from "@/services/api/clothes-request.api";
import type {
  CreateClothesRequestDto,
  UpdateClothesRequestDto,
} from "@/types/dto/clothes-request.dto";
import type { AppAxiosError } from "@/types/error-response";
import type { ClothesRequest } from "@/types/clothes-request";

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
