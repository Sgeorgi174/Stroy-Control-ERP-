import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDeviceTransferPhoto } from "@/services/api/user.api";
import { useEffect } from "react";

export const useGetDeviceTransferPhoto = (
  transferId: string,
  enabled = false
) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["transfer-photo", transferId],
    queryFn: () => getDeviceTransferPhoto(transferId),
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
