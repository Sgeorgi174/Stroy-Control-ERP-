import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import type { CreateSkillDto } from "@/types/dto/skill.dto";
import { createSkill } from "@/services/api/skill";

export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSkillDto) => createSkill(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success(`Навык «${data.skill}» успешно создан`);
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось создать новый навык";
      toast.error(message);
    },
  });
};
