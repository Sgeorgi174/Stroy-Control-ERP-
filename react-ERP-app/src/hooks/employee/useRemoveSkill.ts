import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeSkill } from "@/services/api/employee.api";
import type { RemoveSkillDto } from "@/types/dto/employee.dto";
import toast from "react-hot-toast";
import type { AppAxiosError } from "@/types/error-response";

export const useRemoveSkill = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RemoveSkillDto) => removeSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Навык удален");
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось удалить навык";
      toast.error(message);
    },
  });
};
