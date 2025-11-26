import { Button } from "@/components/ui/button";
import { useSkill } from "@/hooks/skill/useSkill";
import { useAddSkill } from "@/hooks/employee/useAddSkill";
import { useRemoveSkill } from "@/hooks/employee/useRemoveSkill";
import type { Employee } from "@/types/employee";
import { Award, CirclePlus, LoaderCircle, Plus, Trash } from "lucide-react";
import { useEmployeeById } from "@/hooks/employee/useEmployeeById";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            Доступные навыки
            <Badge variant="secondary" className="ml-auto">
              {availableSkills.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isGetSkillLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoaderCircle className="w-6 h-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Загрузка навыков...</span>
            </div>
          ) : availableSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="group flex items-center justify-between p-3 border border-gray-200 rounded-lg "
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Award className="w-4 h-4 text-gray-400 group-hover:text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium  truncate">
                      {skill.skill}
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-6 mx-2" />
                  <Button
                    disabled={isAnyLoading}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-700"
                    onClick={() => handleAddSkill(skill.id)}
                  >
                    {isAnyLoading ? (
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                    ) : (
                      <CirclePlus className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                {"Все доступные навыки уже добавлены"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Навыки сотрудника
            <Badge variant="secondary" className="ml-auto">
              {employeeSkillIds.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isFetchingEmployee ? (
            <div className="flex items-center justify-center py-8">
              <LoaderCircle className="w-6 h-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Обновление данных...</span>
            </div>
          ) : currentEmployee.skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentEmployee.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="group flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-blue-50 "
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Award className="w-4 h-4 text-blue-600 hover:text-red-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-blue-900 ">
                      {skill.skill}
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-6 mx-2" />
                  <Button
                    disabled={isAnyLoading}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-700 hover:bg-red-100 "
                    onClick={() => handleDeleteSkill(skill.id)}
                  >
                    {isAnyLoading ? (
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                {"У сотрудника пока нет навыков"}
              </p>
              {
                <p className="text-gray-400 text-xs mt-1">
                  Добавьте навыки из списка выше
                </p>
              }
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>
                  Текущие навыки: {(currentEmployee.skills ?? []).length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Доступно для добавления: {availableSkills.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
