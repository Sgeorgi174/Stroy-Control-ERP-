import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X } from "lucide-react";

export function CommentPopover({ comment }: { comment: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button disabled={!comment} variant="outline" className="w-[90px]">
          {comment ? "Смотреть" : "Пусто"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-sm max-h-60 overflow-auto">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="leading-none font-medium">Комментарий:</h4>
            <button onClick={() => setOpen(false)}>
              <X className="w-[18px] cursor-pointer" />
            </button>
          </div>
          <p className="whitespace-break-spaces">{comment}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
