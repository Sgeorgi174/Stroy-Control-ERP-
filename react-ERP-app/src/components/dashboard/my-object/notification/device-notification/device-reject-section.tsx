import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PendingDeviceTransfer } from "@/types/transfers";
import { DevicePhotoSection } from "./device-photo-section";

type ToolRejectSectionProps = {
  deviceTransfer: PendingDeviceTransfer;
  comment: string;
  setComment: (val: string) => void;
};

export function DeviceRejectSection({
  deviceTransfer,
  comment,
  setComment,
}: ToolRejectSectionProps) {
  return (
    <div className="flex justify-between">
      <DevicePhotoSection deviceTransfer={deviceTransfer} />

      <div className="col-8 flex flex-col gap-2">
        <Label>Укажите причину отказа</Label>
        <Textarea
          placeholder="Укажите причину отмены, например (Инструмент пришел неисправным, пришла не та позиция и т.д.)"
          className="resize-none w-[350px] h-full"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
    </div>
  );
}
