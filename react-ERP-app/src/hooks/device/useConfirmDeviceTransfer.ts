import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { confirmDeviceTransfer } from "@/services/api/device.api";

export const useConfirmDeviceTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => confirmDeviceTransfer(id),
    onSuccess: () => {
      toast.success("Передача подтверждена");
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
    onError: () => toast.error("Не удалось подтвердить передачу"),
  });
};
