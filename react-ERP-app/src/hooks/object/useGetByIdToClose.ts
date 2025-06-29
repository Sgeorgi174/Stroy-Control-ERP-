import { getObjectByIdToClose } from "@/services/api/object.api";
import type { ObjectToCloseResponse } from "@/types/objectToCloseResponse";
import { useQuery } from "@tanstack/react-query";

export const useGetObjectByIdToClose = (id: string) =>
  useQuery<ObjectToCloseResponse>({
    queryKey: ["object", id],
    queryFn: () => getObjectByIdToClose(id),
    enabled: !!id,
  });
