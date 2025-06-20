// hooks/object/useDeleteObject.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteObject } from "@/services/api/object.api";

export const useDeleteObject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteObject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objects"] });
    },
  });
};
