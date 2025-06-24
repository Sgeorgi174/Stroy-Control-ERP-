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
import type { User } from "@/types/user";

type AlertDialogRemoveProps = {
  item: User;
  isRemoveDialogOpen: boolean;
  setIsRemoveDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleRemove: () => void;
  isLoading: boolean;
};

export function AlertDialogRemove({
  isRemoveDialogOpen,
  setIsRemoveDialogOpen,
  item,
  handleRemove,
  isLoading,
}: AlertDialogRemoveProps) {
  return (
    <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Подтверждение снятия</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите снять бригадира: "
            {`${item.lastName} ${item.firstName}`}" с объекта?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={handleRemove}
            className="bg-destructive hover:bg-destructive/70"
          >
            {isLoading ? "Сохраняем..." : "Снять"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
