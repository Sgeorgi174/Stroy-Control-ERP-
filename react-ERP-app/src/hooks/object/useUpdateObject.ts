// hooks/object/useUpdateObject.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateObject } from "@/services/api/object.api";
import type { UpdateObjectDto } from "@/types/dto/object.dto";

export const useUpdateObject = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateObjectDto) => updateObject(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objects"] });
      queryClient.invalidateQueries({ queryKey: ["object", id] });
    },
  });
};
