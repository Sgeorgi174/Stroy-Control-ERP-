import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PendingClothesTransfer } from "@/types/transfers";
import { ClothesPhotoSection } from "./clothes-photo-section";

type ClothesRejectSectionProps = {
  clothesTransfer: PendingClothesTransfer;
  comment: string;
  setComment: (val: string) => void;
};

export function ClothesRejectSection({
  clothesTransfer,
  comment,
  setComment,
}: ClothesRejectSectionProps) {
  return (
    <div className="flex justify-between">
      <ClothesPhotoSection clothesTransfer={clothesTransfer} />

      <div className="col-8 flex flex-col gap-2">
        <Label>Укажите причину отказа</Label>
        <Textarea
          placeholder="Укажите причину отмены, например (Пришло неверное кол-во, спецовка ненадалежащего качества, неверный размер или сезон и т.д.)"
          className="resize-none w-[350px] h-full"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
    </div>
  );
}
