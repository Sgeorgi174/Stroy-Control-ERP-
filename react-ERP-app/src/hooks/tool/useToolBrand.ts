// hooks/use-tool-brands.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import {
  createToolBrand,
  deleteToolBrand,
  getToolBrands,
} from "@/services/api/tool.api";

// Хук для получения списка брендов (для Select/Combobox)
export const useToolBrands = () => {
  return useQuery({
    queryKey: ["tool-brands"],
    queryFn: getToolBrands,
  });
};

// Хук для создания бренда
export const useCreateToolBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createToolBrand,
    onSuccess: () => {
      toast.success(`Бренд добавлен`);
      queryClient.invalidateQueries({ queryKey: ["tool-brands"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Ошибка при создании бренда";
      toast.error(message);
    },
  });
};

// Хук для удаления бренда
export const useDeleteToolBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteToolBrand,
    onSuccess: () => {
      toast.success("Бренд удален");
      queryClient.invalidateQueries({ queryKey: ["tool-brands"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось удалить бренд";
      toast.error(message);
    },
  });
};
