import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Role } from "@/types/user";

const userRoles = [
  { id: "1", value: "OWNER", label: "Руководство" },
  { id: "2", value: "MASTER", label: "Старший мастер" },
  { id: "3", value: "ACCOUNTANT", label: "Бухгалтер" },
  { id: "4", value: "FOREMAN", label: "Мастер" },
  { id: "5", value: "ADMIN", label: "Админ" },
  { id: "6", value: "ASSISTANT_MANAGER", label: "Помошник руководителя" },
  { id: "7", value: "HR", label: "HR" },
];

type UserRolesSelectProps = {
  roleValue: Role;
  setRoleValue: (value: Role) => void;
};

export function UserRolesSelect({
  roleValue,
  setRoleValue,
}: UserRolesSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="role">Роль</Label>
      <Select value={roleValue} onValueChange={setRoleValue}>
        <SelectTrigger>
          <SelectValue placeholder="Выберите роль" />
        </SelectTrigger>
        <SelectContent>
          {userRoles.map((role) => (
            <SelectItem key={role.id} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
