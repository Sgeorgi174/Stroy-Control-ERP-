import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { useState } from "react";
import { UserRolesSelect } from "../selects/user-roles-select";
import type { CreateUserDto, UpdateUserDto } from "@/types/dto/user.dto";
import type { Role, User } from "@/types/user";

type CreateUserDialogProps = {
  handleUpdateUser: (userId: string, userData: UpdateUserDto) => void;
  user: User;
};

export function UpdateUserDialog({
  handleUpdateUser,
  user,
}: CreateUserDialogProps) {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateUserDto>({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role,
  });
  return (
    <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать пользователя</DialogTitle>
          <DialogDescription>
            Заполните данные для обновления пользователя в системе
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Имя</Label>
              <Input
                id="firstName"
                placeholder="Введите имя"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Фамилия</Label>
              <Input
                id="lastName"
                placeholder="Введите фамилию"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Номер телефона</Label>
            <Input
              id="phone"
              placeholder="+79991234567"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <UserRolesSelect
            roleValue={formData.role}
            setRoleValue={(value: Role) =>
              setFormData({ ...formData, role: value })
            }
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsUpdateDialogOpen(false)}
          >
            Отмена
          </Button>
          <Button
            onClick={() => {
              handleUpdateUser(user.id, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                role: formData.role,
              });
              setIsUpdateDialogOpen(false);
            }}
          >
            Обновить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
