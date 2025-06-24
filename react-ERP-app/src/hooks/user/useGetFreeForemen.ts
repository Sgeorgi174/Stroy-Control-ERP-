import { useQuery } from "@tanstack/react-query";
import { getFreeForemen } from "@/services/api/user.api";

export const useGetFreeForemen = () => {
  return useQuery({
    queryKey: ["foremen"],
    queryFn: getFreeForemen,
  });
};
