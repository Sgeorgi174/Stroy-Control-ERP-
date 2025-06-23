// components/alert-dialog-release.tsx

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
import type { Tablet } from "@/types/tablet";

type AlertDialogReleaseProps = {
  tablet: Tablet;
  isReleaseDialogOpen: boolean;
  setIsReleaseDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleRelease: () => void;
  isLoading: boolean;
};

export function AlertDialogRelease({
  tablet,
  isReleaseDialogOpen,
  setIsReleaseDialogOpen,
  handleRelease,
  isLoading,
}: AlertDialogReleaseProps) {
  return (
    <AlertDialog
      open={isReleaseDialogOpen}
      onOpenChange={setIsReleaseDialogOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Подтвердите возврат</AlertDialogTitle>
          <AlertDialogDescription>
            Вернуть планшет "{tablet.name}" от сотрудника{" "}
            <strong>
              {tablet.employee?.lastName} {tablet.employee?.firstName}
            </strong>
            ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={handleRelease}>
            {isLoading ? "Возвращаем..." : "Вернуть"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
