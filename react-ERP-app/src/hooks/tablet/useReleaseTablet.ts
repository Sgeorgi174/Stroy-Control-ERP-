import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { releaseTablet } from "@/services/api/tablet.api";

export const useReleaseTablet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tabletId: string) => releaseTablet(tabletId),
    onSuccess: () => {
      toast.success("Планшет успешно возвращен в статус 'Свободен'");
      queryClient.invalidateQueries({ queryKey: ["tablets"] });
    },
    onError: () => toast.error("Не удалось освободить устройство"),
  });
};
