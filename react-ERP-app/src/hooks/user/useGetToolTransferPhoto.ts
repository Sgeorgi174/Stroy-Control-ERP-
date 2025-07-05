import { useQuery } from "@tanstack/react-query";
import { getToolTransferPhoto } from "@/services/api/user.api";

export const useGetToolTransferPhoto = (
  transferId: string,
  enabled = false
) => {
  return useQuery({
    queryKey: ["transfer-photo", transferId],
    queryFn: () => getToolTransferPhoto(transferId),
    enabled: enabled,
    refetchInterval: 5000,
  });
};
