import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils/format-date";
import type { Role, User } from "@/types/user";
import { UpdateUserDialog } from "./dialogs/update-user-dialog";
import type { UpdateUserDto } from "@/types/dto/user.dto";
import { DeleteUserDialog } from "./dialogs/delete-user-dialog";

type AdminPanelProps = {
  users: User[];
  handleUpdateUser: (userId: string, userData: UpdateUserDto) => void;
  handleDeleteUser: (userId: string) => void;
};

const getRoleBadgeColor = (role: Role) => {
  switch (role) {
    case "ADMIN":
      return "bg-red-100 text-red-800";
    case "FOREMAN":
      return "bg-blue-100 text-blue-800";
    case "ACCOUNTANT":
      return "bg-green-100 text-green-800";
    case "OWNER":
      return "bg-purple-100 text-purple-800";
    case "MASTER":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function AdminPanel({
  users,
  handleUpdateUser,
  handleDeleteUser,
}: AdminPanelProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Список пользователей</CardTitle>
        <CardDescription>Найдено пользователей: {users.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ФИО</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Дата создания</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {`${user.lastName} ${user.firstName}`}
                </TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <UpdateUserDialog
                      user={user}
                      handleUpdateUser={handleUpdateUser}
                    />
                    <DeleteUserDialog
                      userName={`${user.firstName} ${user.lastName}`}
                      handleDeleteUser={() => handleDeleteUser(user.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  Пользователи не найдены
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
