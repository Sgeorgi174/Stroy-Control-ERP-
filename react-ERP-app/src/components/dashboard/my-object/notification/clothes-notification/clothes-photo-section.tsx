import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Image, LoaderCircle } from "lucide-react";
import type { PendingClothesTransfer } from "@/types/transfers";
import { photoUrl } from "@/constants/baseUrl";
import { useGetClothesTransferPhoto } from "@/hooks/user/useGetClothesTransferPhoto";
import { useRequestClothesPhoto } from "@/hooks/clothes/useClothes";

interface ClothesPhotoSectionProps {
  clothesTransfer: PendingClothesTransfer;
}

export const ClothesPhotoSection = ({
  clothesTransfer,
}: ClothesPhotoSectionProps) => {
  const [isPoolingPhoto, setIsPoolingPhoto] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(clothesTransfer.updatedAt);

  const { mutateAsync: requestPhoto } = useRequestClothesPhoto();
  const { data: clothesTransferData } = useGetClothesTransferPhoto(
    clothesTransfer.id,
    isPoolingPhoto
  );

  // Выбираем актуальный URL фото, если он есть
  const currentPhotoUrl =
    clothesTransferData?.photoUrl || clothesTransfer.photoUrl;
  const hasPhoto = !!currentPhotoUrl;

  const handleWaitingPhoto = async () => {
    // Сохраняем время последнего обновления перед запросом нового фото
    setLastUpdatedAt(
      clothesTransferData?.updatedAt || clothesTransfer.updatedAt
    );
    await requestPhoto(clothesTransfer.id);
    setIsPoolingPhoto(true);
  };

  useEffect(() => {
    if (
      isPoolingPhoto &&
      clothesTransferData?.updatedAt &&
      clothesTransferData.updatedAt !== lastUpdatedAt
    ) {
      setIsPoolingPhoto(false);
      setLastUpdatedAt(clothesTransferData.updatedAt);
    }
  }, [clothesTransferData?.updatedAt, isPoolingPhoto, lastUpdatedAt]);

  return (
    <div className="col-4 flex flex-col w-[250px] gap-y-4">
      <div className="w-[250px] h-[333px] bg-muted/30 rounded-md flex justify-center overflow-hidden items-center">
        {hasPhoto && !isPoolingPhoto ? (
          <img
            className="w-full rounded-md"
            src={`${photoUrl}${currentPhotoUrl}?t=${Date.now()}`}
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
