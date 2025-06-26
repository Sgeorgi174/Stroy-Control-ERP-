import { useConfirmClothesTransfer } from "./clothes/useClothes";
import { useConfirmDeviceTransfer } from "./device/useConfirmDeviceTransfer";
import { useConfirmToolTransfer } from "./tool/useConfirmToolTransfer";
import { useQueryClient } from "@tanstack/react-query";
import type { NotificationWithType } from "@/types/notificationWithType";

export const useConfirmTransfer = (item: NotificationWithType) => {
  const queryClient = useQueryClient();

  const confirmClothesMutation = useConfirmClothesTransfer();
  const confirmDeviceMutation = useConfirmDeviceTransfer();
  const confirmToolMutation = useConfirmToolTransfer();

  const handleConfirm = (quantity: number) => {
    switch (item.itemType) {
      case "clothes":
        confirmClothesMutation.mutate(
          {
            id: item.id,
            quantity: quantity,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ["user-notifications"],
              });
            },
          }
        );
        break;

      case "device":
        confirmDeviceMutation.mutate(item.id, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
          },
        });
        break;

      case "tool":
        confirmToolMutation.mutate(item.id, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
          },
        });
        break;
    }
  };

  const isPending =
    confirmClothesMutation.isPending ||
    confirmDeviceMutation.isPending ||
    confirmToolMutation.isPending;

  const isSuccess =
    confirmClothesMutation.isSuccess ||
    confirmDeviceMutation.isSuccess ||
    confirmToolMutation.isSuccess;

  return {
    handleConfirm,
    isPending,
    isSuccess,
  };
};
