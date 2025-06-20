// hooks/object/useObjectByUser.ts
import { useQuery } from "@tanstack/react-query";
import { getObjectByUser } from "@/services/api/object.api";

export const useObjectByUser = () =>
  useQuery({
    queryKey: ["object", "user"],
    queryFn: getObjectByUser,
  });
