import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Image, LoaderCircle } from "lucide-react";
import type { PendingDeviceTransfer } from "@/types/transfers";
import { baseUrl } from "@/constants/baseUrl";
import { useRequestDevicePhoto } from "@/hooks/device/useRequestDevicePhoto";
import { useGetDeviceTransferPhoto } from "@/hooks/user/useGetDeviceTransferPhoto";

interface DevicePhotoSectionProps {
  deviceTransfer: PendingDeviceTransfer;
}

export const DevicePhotoSection = ({
  deviceTransfer,
}: DevicePhotoSectionProps) => {
  const [isPoolingPhoto, setIsPoolingPhoto] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(deviceTransfer.updatedAt);

  const { mutateAsync: requestPhoto } = useRequestDevicePhoto();
  const { data: deviceTransferData } = useGetDeviceTransferPhoto(
    deviceTransfer.id,
    isPoolingPhoto
  );

  // Выбираем актуальный URL фото, если он есть
  const currentPhotoUrl =
    deviceTransferData?.photoUrl || deviceTransfer.photoUrl;
  const hasPhoto = !!currentPhotoUrl;

  const handleWaitingPhoto = async () => {
    // Сохраняем время последнего обновления перед запросом нового фото
    setLastUpdatedAt(deviceTransferData?.updatedAt || deviceTransfer.updatedAt);
    await requestPhoto(deviceTransfer.id);
    setIsPoolingPhoto(true);
  };

  useEffect(() => {
    if (
      isPoolingPhoto &&
      deviceTransferData?.updatedAt &&
      deviceTransferData.updatedAt !== lastUpdatedAt
    ) {
      setIsPoolingPhoto(false);
      setLastUpdatedAt(deviceTransferData.updatedAt);
    }
  }, [deviceTransferData?.updatedAt, isPoolingPhoto, lastUpdatedAt]);

  return (
    <div className="col-4 flex flex-col w-[250px] gap-y-4">
      <div className="w-[250px] h-[333px] bg-muted/30 rounded-md flex justify-center overflow-hidden items-center">
        {hasPhoto && !isPoolingPhoto ? (
          <img
            className="w-full rounded-md"
            src={`${baseUrl}${currentPhotoUrl}?t=${Date.now()}`}
            alt="Фото инструмента"
          />
        ) : isPoolingPhoto ? (
          <div className="flex flex-col items-center gap-2">
            <LoaderCircle className="w-10 h-10 animate-spin" />
            <span className="text-xs text-muted-foreground">
              Ждем фото от бота
            </span>
          </div>
        ) : (
          <Image className="w-10 h-10 text-muted-foreground" />
        )}
      </div>

      <Button
        className="w-[250px]"
        onClick={handleWaitingPhoto}
        disabled={isPoolingPhoto}
      >
        {isPoolingPhoto ? (
          <>
            <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
            Ожидание фото...
          </>
        ) : hasPhoto ? (
          "Изменить фото"
        ) : (
          "Вызвать бота для отправки фото"
        )}
      </Button>
    </div>
  );
};
