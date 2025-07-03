import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../ui/alert-dialog";
import type { Employee } from "@/types/employee";

type AlertDialogRestoreProps = {
  item: Employee;
  isRestoreDialogOpen: boolean;
  setIsRestoreDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleRestore: () => void;
  isLoading: boolean;
};

export function AlertDialogRestore({
  isRestoreDialogOpen,
  setIsRestoreDialogOpen,
  item,
  handleRestore,
  isLoading,
}: AlertDialogRestoreProps) {
  return (
    <AlertDialog
      open={isRestoreDialogOpen}
      onOpenChange={setIsRestoreDialogOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Подтверждение восстановления</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите восстановить сотрудника: "
            {`${item.lastName} ${item.firstName} ${item.fatherName}`}"?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={handleRestore}>
            {isLoading ? "Восстанавливаем..." : "Восстановить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
