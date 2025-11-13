import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIssuedClothing } from "@/services/api/employee.api";
import toast from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import type { UpdateIssuedClothingDto } from "@/types/employeesClothing";

/** 🔧 Хук для обновления данных выданной одежды */
export const useUpdateIssuedClothing = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown, // возвращаемый тип mutate
    AppAxiosError,
    { recordId: string; data: UpdateIssuedClothingDto } // аргумент mutate
  >({
    mutationFn: ({ recordId, data }) => updateIssuedClothing(recordId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-clothing"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Данные о выданной одежде успешно обновлены");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Не удалось обновить данные о выданной одежде";
      toast.error(message);
    },
  });
};
