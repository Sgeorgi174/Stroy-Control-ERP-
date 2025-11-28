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
import { EmployeeClothingSection } from "./edit-clothes/Edit-clothes";
import { useEmployees } from "@/hooks/employee/useEmployees";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GenerateEmployees } from "./generate-employees";
import { useAuth } from "@/hooks/auth/useAuth";
import { S3UploadTest } from "./S3UploadTest";

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
  const { data: employees = [] } = useEmployees({
    searchQuery: "",
    objectId: "all",
    position: undefined,
    status: null,
    skillIds: "",
    type: "ACTIVE",
  });

  const { data: user } = useAuth();
  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Список пользователей</CardTitle>
          <CardDescription>
            Найдено пользователей: {users.length}
          </CardDescription>
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

      <S3UploadTest />

      {user?.role === "ADMIN" && (
        <div className="mt-6">
          <GenerateEmployees objectId="908eeaf5-1deb-496a-a411-f2281e7c1543" />
        </div>
      )}

      {user?.role === "ADMIN" && (
        <div className="mt-10">
          <p className="text-2xl font-medium">Редактирование спецовки</p>
          <Accordion type="single" collapsible className="w-full  mt-5">
            {employees.map((employee) => (
              <AccordionItem
                className="mt-2 bg-muted rounded-xl px-5"
                value={employee.id}
                key={employee.id}
              >
                <AccordionTrigger>
                  {employee.lastName} {employee.firstName} {employee.fatherName}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <EmployeeClothingSection
                    employeeClothes={employee.clothing}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </>
  );
}
