import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSkill } from "@/services/api/employee.api";
import type { AddSkillsDto } from "@/types/dto/employee.dto";
import toast from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";

export const useAddSkill = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddSkillsDto) => addSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
      toast.success("Навык добавлен");
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось добавить навык";
      toast.error(message);
    },
  });
};
