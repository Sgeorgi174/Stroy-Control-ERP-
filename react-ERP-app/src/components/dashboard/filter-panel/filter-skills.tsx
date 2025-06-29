import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Skill } from "@/types/employee";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilterPanelStore } from "@/stores/filter-panel-store";

type SkillsFilterPopoverProps = {
  skills: Skill[];
};

export function SkillsFilterPopover({ skills }: SkillsFilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const selectedSkills = useFilterPanelStore((s) => s.selectedSkills);
  const toggleSkill = useFilterPanelStore((s) => s.toggleSkill);

  console.log(selectedSkills);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-[90px] bg-accent text-accent-foreground border hover:text-accent p-1">
          {"Навыки"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px]">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="leading-none font-medium">Навыки:</h4>
            <button onClick={() => setOpen(false)}>
              <X className="w-[18px] cursor-pointer" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => {
              const isChecked = selectedSkills.includes(skill.id);
              return (
                <Card
                  className="flex flex-row items-center p-2 px-3 border-2"
                  key={skill.id}
                >
                  <Checkbox
                    onClick={() => toggleSkill(skill.id)}
                    checked={isChecked}
                  />
                  <p>{skill.skill}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
