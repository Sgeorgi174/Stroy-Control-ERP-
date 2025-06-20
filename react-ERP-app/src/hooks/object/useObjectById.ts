// hooks/object/useObjectById.ts
import { useQuery } from "@tanstack/react-query";
import { getObjectById } from "@/services/api/object.api";

export const useObjectById = (id: string) =>
  useQuery({
    queryKey: ["object", id],
    queryFn: () => getObjectById(id),
    enabled: !!id,
  });
