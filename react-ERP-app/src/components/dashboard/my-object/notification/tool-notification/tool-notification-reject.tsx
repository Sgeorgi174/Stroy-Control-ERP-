import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToolPhotoSection } from "./tool-photo-section";
import type { PendingToolTransfer } from "@/types/transfers";

type ToolRejectSectionProps = {
  toolTransfer: PendingToolTransfer;
  comment: string;
  setComment: (val: string) => void;
};

export function ToolRejectSection({
  toolTransfer,
  comment,
  setComment,
}: ToolRejectSectionProps) {
  return (
    <div className="flex justify-between">
      <ToolPhotoSection toolTransfer={toolTransfer} />

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
