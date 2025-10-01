import { AdminPanel } from "@/components/dashboard/admin-panel/admin-panel";
import { CreateUserDialog } from "@/components/dashboard/admin-panel/dialogs/create-user-dialog";
import { useCreateUser } from "@/hooks/user/useCreateUser";
import { useDeleteUser } from "@/hooks/user/useDeleteUser";
import { useGetAllUsers } from "@/hooks/user/useGetAllUsers";
import { useUpdateUser } from "@/hooks/user/useUpdateUser";
import type { UpdateUserDto } from "@/types/dto/user.dto";
import { Users } from "lucide-react";

export function AdminPanelPage() {
  const { data: users = [] } = useGetAllUsers();
  const { mutate: createUser } = useCreateUser();
  const { mutate: updateUser } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={30} />
          <p className="text-2xl font-medium">Управление пользователями</p>
        </div>
        <CreateUserDialog handleCreateUser={createUser} />
      </div>
      <AdminPanel
        users={users}
        handleUpdateUser={(userId: string, userData: UpdateUserDto) =>
          updateUser({ userId: userId, ...userData })
        }
        handleDeleteUser={deleteUser}
      />
    </div>
  );
}
