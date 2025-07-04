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

type AlertDialogUnassignFromObjectProps = {
  item: Employee;
  isUnassignDialogOpen: boolean;
  setIsUnassignDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUnassign: () => void;
  isLoading: boolean;
};

export function AlertDialogUnassignFromObject({
  isUnassignDialogOpen,
  setIsUnassignDialogOpen,
  item,
  handleUnassign,
  isLoading,
}: AlertDialogUnassignFromObjectProps) {
  return (
    <AlertDialog
      open={isUnassignDialogOpen}
      onOpenChange={setIsUnassignDialogOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Подтверждение снятия с объекта "{`${item.workPlace?.name}`}"
          </AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите снять сотрудника: "
            {`${item.lastName} ${item.firstName} ${item.fatherName}`} с
            указанного объекта"?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={handleUnassign}>
            {isLoading ? "Снимаем..." : "Снять"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
