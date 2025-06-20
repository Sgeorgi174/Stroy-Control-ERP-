// hooks/object/useCreateObject.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createObject } from "@/services/api/object.api";

export const useCreateObject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createObject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objects"] });
    },
  });
};
