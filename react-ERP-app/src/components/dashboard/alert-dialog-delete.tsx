import type { Clothes } from "@/types/clothes";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import type { Tool } from "@/types/tool";
import type { Device } from "@/types/device";
import type { Tablet } from "@/types/tablet";
import type { Object } from "@/types/object";
import type { Employee } from "@/types/employee";

type AlertDialogDeleteProps = {
  item: Clothes | Tool | Device | Tablet | Object | Employee;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
  isLoading: boolean;
};

export function AlertDialogDelete({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  item,
  handleDelete,
  isLoading,
}: AlertDialogDeleteProps) {
  const itemLabel =
    "lastName" in item && "firstName" in item
      ? `${item.lastName} ${item.firstName}`
      : "name" in item
      ? item.name
      : "объект";

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить "{itemLabel}"?
            <br />
            Это действие нельзя отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/70"
          >
            {isLoading ? "Удаляем..." : "Удалить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
