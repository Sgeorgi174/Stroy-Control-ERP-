import { useMutation, useQueryClient } from "@tanstack/react-query";
import { issueCustomClothes } from "@/services/api/employee.api";
import toast from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import type { IssueCustomClothesDto } from "@/types/dto/clothes.dto";

export const useIssueCustomClothes = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IssueCustomClothesDto) => issueCustomClothes(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-clothing"] });
      toast.success("Новая одежда добавлена");
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message ||
        "Не удалось обновить одежду сотрудника";
      toast.error(message);
    },
  });
};
