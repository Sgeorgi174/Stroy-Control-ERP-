import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  createMaterialDelivery,
  getMaterialDeliveryArchive,
  deleteMaterialDelivery,
  updateMaterialDelivery,
} from "@/services/api/material-delivery.api";
import type { MaterialDelivery } from "@/types/material-delivery";
import type { AppAxiosError } from "@/types/error-response";
import type {
  CreateMaterialDeliveryDto,
  GetMaterialDeliveryFilterDto,
  UpdateMaterialDeliveryDto,
} from "@/types/dto/material-delivery.dto";

const KEY = "material-deliveries";

// 🔹 Получить архив за месяц
export const useMaterialDeliveryArchive = (
  objectId: string,
  filters: GetMaterialDeliveryFilterDto,
) => {
  return useQuery<MaterialDelivery[]>({
    queryKey: [KEY, objectId, filters.year, filters.month],
    queryFn: () => getMaterialDeliveryArchive(objectId, filters),
    enabled: !!objectId,
  });
};

// 🔹 Создать запись
export const useCreateMaterialDelivery = (objectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMaterialDeliveryDto) =>
      createMaterialDelivery(data),
    onSuccess: () => {
      toast.success("Данные о поставке сохранены");
      queryClient.invalidateQueries({ queryKey: [KEY, objectId] });
    },
    onError: (error: AppAxiosError) => {
      const message = error?.response?.data?.message || "Ошибка при сохранении";
      toast.error(message);
    },
  });
};

// 🔹 Обновить запись
export const useUpdateMaterialDelivery = (objectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMaterialDeliveryDto;
    }) => updateMaterialDelivery(id, data),
    onSuccess: () => {
      toast.success("Запись обновлена");
      queryClient.invalidateQueries({ queryKey: [KEY, objectId] });
    },
    onError: (error: AppAxiosError) => {
      const message = error?.response?.data?.message || "Ошибка при обновлении";
      toast.error(message);
    },
  });
};

// 🔹 Удалить запись
export const useDeleteMaterialDelivery = (objectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMaterialDelivery(id),
    onSuccess: () => {
      toast.success("Запись удалена");
      queryClient.invalidateQueries({ queryKey: [KEY, objectId] });
    },
    onError: () => {
      toast.error("Ошибка при удалении");
    },
  });
};
