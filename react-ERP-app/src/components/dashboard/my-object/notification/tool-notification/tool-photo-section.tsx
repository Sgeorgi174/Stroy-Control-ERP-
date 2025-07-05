import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Image, LoaderCircle } from "lucide-react";
import { useRequestToolPhoto } from "@/hooks/tool/useRequestToolPhoto";
import { useGetToolTransferPhoto } from "@/hooks/user/useGetToolTransferPhoto";
import type { PendingToolTransfer } from "@/types/transfers";
import { baseUrl } from "@/constants/baseUrl";

interface ToolPhotoSectionProps {
  toolTransfer: PendingToolTransfer;
}

export const ToolPhotoSection = ({ toolTransfer }: ToolPhotoSectionProps) => {
  const [isPoolingPhoto, setIsPoolingPhoto] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(toolTransfer.updatedAt);

  const { mutateAsync: requestPhoto } = useRequestToolPhoto();
  const { data: toolTransferData } = useGetToolTransferPhoto(
    toolTransfer.id,
    isPoolingPhoto
  );

  // Выбираем актуальный URL фото, если он есть
  const currentPhotoUrl = toolTransferData?.photoUrl || toolTransfer.photoUrl;
  const hasPhoto = !!currentPhotoUrl;

  const handleWaitingPhoto = async () => {
    // Сохраняем время последнего обновления перед запросом нового фото
    setLastUpdatedAt(toolTransferData?.updatedAt || toolTransfer.updatedAt);
    await requestPhoto(toolTransfer.id);
    setIsPoolingPhoto(true);
  };

  useEffect(() => {
    if (
      isPoolingPhoto &&
      toolTransferData?.updatedAt &&
      toolTransferData.updatedAt !== lastUpdatedAt
    ) {
      setIsPoolingPhoto(false);
      setLastUpdatedAt(toolTransferData.updatedAt);
    }
  }, [toolTransferData?.updatedAt, isPoolingPhoto, lastUpdatedAt]);

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
