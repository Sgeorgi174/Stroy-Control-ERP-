import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

type DescriptionPopoverProps = {
  text: string;
  maxLength?: number;
};

export function DescriptionPopover({
  text,
  maxLength = 40,
}: DescriptionPopoverProps) {
  const shortened =
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  return (
    <Popover>
      <PopoverTrigger
        className="underline cursor-pointer text-left"
        onClick={(e) => e.stopPropagation()} // важно!
      >
        {shortened}
      </PopoverTrigger>

      <PopoverContent className="max-w-sm whitespace-pre-wrap">
        {text}
      </PopoverContent>
    </Popover>
  );
}
