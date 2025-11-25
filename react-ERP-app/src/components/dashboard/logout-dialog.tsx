import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/useLogout";
import React from "react";

interface LogoutDialogProps {
  children: React.ReactNode; // кнопка-триггер (LogOut icon)
}

export function LogoutDialog({ children }: LogoutDialogProps) {
  const logoutMutation = useLogout();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Подтверждение выхода</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите выйти из аккаунта?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline">Отмена</Button>
          <Button
            variant="destructive"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Выходим..." : "Выйти"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
