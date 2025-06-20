// hooks/object/useObjects.ts
import { useQuery } from "@tanstack/react-query";
import { getAllObjects } from "@/services/api/object.api";

export const useObjects = () =>
  useQuery({
    queryKey: ["objects"],
    queryFn: getAllObjects,
  });
