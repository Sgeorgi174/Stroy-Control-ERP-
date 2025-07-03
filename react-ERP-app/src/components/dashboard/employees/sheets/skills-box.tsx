import type { Employee } from "@/types/employee";

type EmployeeSkillsBoxProps = { employee: Employee };

export function EmployeeSkillsBox({ employee }: EmployeeSkillsBoxProps) {
  return (
    <>
      <div className="flex mt-6">
        <p>Навыки: </p>
        <div className="flex flex-col items-start gap-2">
          {employee.skills.map((skill) => (
            <p
              className=" text-center px-2 rounded-2xl font-medium"
              key={skill.id}
            >
              - {skill.skill}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
