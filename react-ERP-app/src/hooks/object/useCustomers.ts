import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  updateCustomer,
} from "@/services/api/object.api";
import type {
  CreateCustomerDto,
  UpdateCustomerDto,
} from "@/types/dto/object.dto";
import type { AppAxiosError } from "@/types/error-response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: () => getAllCustomers(),
  });
};

// Создание поставщика
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerDto) => createCustomer(data),
    onSuccess: () => {
      toast.success("Заказчик успешно создан");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось создать заказчика";
      toast.error(message);
    },
  });
};

// Обновление поставщика
export const useUpdateCustomer = (customerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCustomerDto) => updateCustomer(customerId, data),
    onSuccess: () => {
      toast.success("Заказчик успешно обновлён");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось обновить заказчика";
      toast.error(message);
    },
  });
};

// Удаление поставщика
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId: string) => deleteCustomer(customerId),
    onSuccess: () => {
      toast.success("Заказчик успешно удалён");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось удалить заказчика";
      toast.error(message);
    },
  });
};
