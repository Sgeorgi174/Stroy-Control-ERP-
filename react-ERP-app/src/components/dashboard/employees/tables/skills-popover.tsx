import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";

type SkillsPopover = {
  skills: { id: string; skill: string }[];
};

export function SkillsPopover({ skills }: SkillsPopover) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-[90px] bg-accent text-accent-foreground border hover:text-accent p-1 rounded-2xl">
          {"Навыки"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="leading-none font-medium">Навыки:</h4>
            <button onClick={() => setOpen(false)}>
              <X className="w-[18px] cursor-pointer" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Card
                className="flex justify-center items-center p-2 border-2"
                key={skill.id}
              >
                {skill.skill}
              </Card>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
