import { Button } from "@/components/ui/button";
import { useSkill } from "@/hooks/skill/useSkill";
import { useAddSkill } from "@/hooks/employee/useAddSkill";
import { useRemoveSkill } from "@/hooks/employee/useRemoveSkill";
import type { Employee } from "@/types/employee";
import { CirclePlus, LoaderCircle, Trash } from "lucide-react";
import { useEmployeeById } from "@/hooks/employee/useEmployeeById";

type EmployeeSkillsEditProps = { employee: Employee };

export function EmployeeSkillsEdit({ employee }: EmployeeSkillsEditProps) {
  const { data: skills = [], isLoading: isGetSkillLoading } = useSkill();
  const { data: currentEmployee = employee, isFetching: isFetchingEmployee } =
    useEmployeeById(employee.id);

  const employeeSkillIds = currentEmployee.skills.map((s) => s.id);
  const availableSkills = skills.filter(
    (skill) => !employeeSkillIds.includes(skill.id)
  );

  const { mutate: addSkill, isPending: isAddSkillLoading } = useAddSkill(
    employee.id
  );
  const { mutate: removeSkill, isPending: isRemoveSkillLoading } =
    useRemoveSkill(employee.id);

  const handleAddSkill = (skillId: string) => {
    addSkill({ skillIds: [skillId] });
  };

  const handleDeleteSkill = (skillId: string) => {
    removeSkill({ skillId: skillId });
  };

  const isAnyLoading = [
    isAddSkillLoading,
    isRemoveSkillLoading,
    isGetSkillLoading,
    isFetchingEmployee,
  ].some(Boolean);

  return (
    <div className="p-5 flex flex-col gap-4">
      <div>
        <p className="font-semibold mb-2">Навыки, доступные для добавления</p>
        <div className="p-3 grid grid-cols-3 gap-2">
          {availableSkills.length > 0 ? (
            availableSkills.map((skill) => (
              <div
                className="border px-3 py-1 flex rounded-xl items-center justify-between gap-2"
                key={skill.id}
              >
                <p>{skill.skill}</p>
                <div className="flex items-center">
                  <div className="w-[2px] h-[25px] bg-secondary mr-2" />
                  <Button
                    disabled={isAnyLoading}
                    variant="ghost"
                    className="p-0"
                    onClick={() => handleAddSkill(skill.id)}
                  >
                    {isAnyLoading ? (
                      <LoaderCircle size={18} className="animate-spin" />
                    ) : (
                      <CirclePlus size={18} />
                    )}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Все доступные навыки уже добавлены
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="font-semibold mb-2">Навыки сотрудника</p>
        <div className="p-3 grid grid-cols-3 gap-2">
          {currentEmployee.skills.length > 0 ? (
            currentEmployee.skills.map((skill) => (
              <div
                className="border px-3 py-1 flex rounded-xl items-center justify-between gap-2"
                key={skill.id}
              >
                <p>{skill.skill}</p>
                <div className="flex items-center">
                  <div className="w-[2px] h-[25px] bg-secondary mr-2" />
                  <Button
                    disabled={isAnyLoading}
                    variant="ghost"
                    className="p-0"
                    onClick={() => handleDeleteSkill(skill.id)}
                  >
                    {isAnyLoading ? (
                      <LoaderCircle size={18} className="animate-spin" />
                    ) : (
                      <Trash size={18} />
                    )}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              У сотрудника пока нет навыков
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
