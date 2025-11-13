import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Employee } from "@/types/employee";
import { TriangleAlert } from "lucide-react";

type EmployeeWarningBoxProps = { employee: Employee };

export function EmployeeWarningBox({ employee }: EmployeeWarningBoxProps) {
  console.log(employee);

  return (
    <div className="flex flex-col gap-5">
      <Card className="bg-yellow-300/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TriangleAlert className="w-5 h-5 text-red-500" />
            Обратите внимание
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {employee.warnings.map((warning, index) => (
            <div key={warning.id}>
              <p className="font-medium">
                <span>{index + 1}.</span> {warning.message}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
