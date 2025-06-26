// hooks/object/useObjectById.ts
import { getObjectByIdToClose } from "@/services/api/object.api";
import { useQuery } from "@tanstack/react-query";

export const useGetObjectByIdToClose = (id: string) =>
  useQuery({
    queryKey: ["object", id],
    queryFn: () => getObjectByIdToClose(id),
    enabled: !!id,
  });
