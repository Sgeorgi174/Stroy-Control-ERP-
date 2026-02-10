import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  getAllAdditionalStorages,
  createAdditionalStorage,
  updateAdditionalStorage,
  deleteAdditionalStorage,
} from "@/services/api/additional-storage.api";
import type {
  CreateAdditionalStorageDto,
  UpdateAdditionalStorageDto,
} from "@/types/dto/additional-storage.dto";
import type { AppAxiosError } from "@/types/error-response";

// Получить все склады
export const useAdditionalStorages = () => {
  return useQuery({
    queryKey: ["additional-storages"],
    queryFn: () => getAllAdditionalStorages(),
  });
};

// Создать склад
export const useCreateAdditionalStorage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdditionalStorageDto) =>
      createAdditionalStorage(data),
    onSuccess: (data) => {
      toast.success(`Склад «${data.name}» успешно создан`);
      queryClient.invalidateQueries({ queryKey: ["additional-storages"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось создать склад";
      toast.error(message);
    },
  });
};

// Обновление склада
export const useUpdateAdditionalStorage = (storageId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAdditionalStorageDto) =>
      updateAdditionalStorage(storageId, data),
    onSuccess: (data) => {
      toast.success(`Склад «${data.name}» успешно обновлён`);
      queryClient.invalidateQueries({ queryKey: ["additional-storages"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось обновить склад";
      toast.error(message);
    },
  });
};

// Удаление склада
export const useDeleteAdditionalStorage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (storageId: string) => deleteAdditionalStorage(storageId),
    onSuccess: () => {
      toast.success("Склад успешно удалён");
      queryClient.invalidateQueries({ queryKey: ["additional-storages"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось удалить склад";
      toast.error(message);
    },
  });
};
