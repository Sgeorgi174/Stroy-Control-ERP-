import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getClothesTransferPhoto } from "@/services/api/user.api";
import { useEffect } from "react";

export const useGetClothesTransferPhoto = (
  transferId: string,
  enabled = false
) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["transfer-photo", transferId],
    queryFn: () => getClothesTransferPhoto(transferId),
    enabled,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (query.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
    }
  }, [query.isSuccess, queryClient]);

  return query;
};
