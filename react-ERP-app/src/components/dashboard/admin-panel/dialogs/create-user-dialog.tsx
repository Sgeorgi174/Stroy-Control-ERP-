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
import { Plus } from "lucide-react";
import { useState } from "react";
import { UserRolesSelect } from "../selects/user-roles-select";
import type { CreateUserDto } from "@/types/dto/user.dto";
import type { Role } from "@/types/user";

type CreateUserDialogProps = {
  handleCreateUser: (userData: CreateUserDto) => void;
};

export function CreateUserDialog({ handleCreateUser }: CreateUserDialogProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateUserDto>({
    firstName: "",
    lastName: "",
    phone: "",
    role: "FOREMAN",
  });

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Добавить пользователя
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить нового пользователя</DialogTitle>
          <DialogDescription>
            Заполните данные для создания нового пользователя в системе
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
            onClick={() => setIsCreateDialogOpen(false)}
          >
            Отмена
          </Button>
          <Button
            onClick={() => {
              handleCreateUser({
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                role: formData.role,
              });
              setFormData({
                firstName: "",
                lastName: "",
                phone: "",
                role: "FOREMAN",
              });
            }}
          >
            Создать пользователя
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
