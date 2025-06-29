// hooks/object/useUpdateObject.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";
import type { UpdateSkillDto } from "@/types/dto/skill.dto";
import { updateSkill } from "@/services/api/skill";

export const useUpdateSkill = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSkillDto) => updateSkill(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success(`Навык «${data.skill}» успешно обновлён`);
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось обновить навык";
      toast.error(message);
    },
  });
};
