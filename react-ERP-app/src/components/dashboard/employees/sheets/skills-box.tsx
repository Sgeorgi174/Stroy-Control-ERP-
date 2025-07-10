import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Employee } from "@/types/employee";
import { Award } from "lucide-react";

type EmployeeSkillsBoxProps = { employee: Employee };

export function EmployeeSkillsBox({ employee }: EmployeeSkillsBoxProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="w-5 h-5" />
          Навыки
        </CardTitle>
      </CardHeader>
      <CardContent>
        {employee.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {employee.skills.map((skill) => (
              <Badge key={skill.id} variant="secondary" className="text-sm">
                {skill.skill}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Навыки не указаны</p>
        )}
      </CardContent>
    </Card>
  );
}
