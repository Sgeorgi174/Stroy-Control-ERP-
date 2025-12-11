import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import type { Tool } from "@/types/tool";
import { useState } from "react";
import { AlertDialogDelete } from "../../alert-dialog-delete";
import { useDeleteTool } from "@/hooks/tool/useDeleteTool";
import { ToolCommentDialog } from "../tool-comment-dialog";
import { useAuth } from "@/hooks/auth/useAuth";

type ToolDropDownProps = {
  tool: Tool;
  setColor: (id: string, color: string) => void;
  resetColor: (id: string) => void;
};

export function ToolsDropDown({
  tool,
  setColor,
  resetColor,
}: ToolDropDownProps) {
  const { openSheet } = useToolsSheetStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data: user } = useAuth();

  const [commentDialog, setCommentDialog] = useState<{
    type: "add" | "edit" | "delete" | null;
  }>({ type: null });

  const deleteMutation = useDeleteTool();

  const handleDelete = async () => {
    deleteMutation.mutate(tool.id, {
      onSuccess: () => setIsDeleteDialogOpen(false),
      onError: () => setIsDeleteDialogOpen(false),
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
          <button className="hover:bg-accent p-1 rounded cursor-pointer">
            <EllipsisVertical />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              openSheet("details", tool);
            }}
          >
            Подробнее
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Задать цвет</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(tool.id, "table-red"); // пастельный красный
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-red"></div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(tool.id, "table-orange"); // пастельный жёлтый
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-orange"></div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(tool.id, "table-blue"); // пастельный голубой
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-blue"></div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(tool.id, "table-purple"); // пастельный сиреневый
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-purple"></div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(tool.id, "table-green"); // пастельный зелёный
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-green"></div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  resetColor(tool.id);
                }}
              >
                Сбросить цвет
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled={user?.role === "FOREMAN"}
            onClick={(e) => {
              e.stopPropagation();
              openSheet("edit", tool);
            }}
          >
            Редактировать
          </DropdownMenuItem>

          {
            <DropdownMenuItem
              disabled={
                tool.status !== "ON_OBJECT" ||
                (user?.role === "FOREMAN" &&
                  ![...user.primaryObjects, ...user.secondaryObjects].some(
                    (obj) => obj.id === tool.objectId
                  ))
              }
              onClick={(e) => {
                e.stopPropagation();
                openSheet("transfer", tool);
              }}
            >
              Переместить
            </DropdownMenuItem>
          }

          {!tool.isBulk && (
            <DropdownMenuItem
              disabled={
                tool.status === "IN_TRANSIT" ||
                tool.status === "LOST" ||
                tool.status === "WRITTEN_OFF" ||
                user?.role === "FOREMAN"
              }
              onClick={(e) => {
                e.stopPropagation();
                openSheet("change status", tool);
              }}
            >
              Сменить статус
            </DropdownMenuItem>
          )}

          {tool.isBulk && (
            <DropdownMenuItem
              disabled={tool.status !== "ON_OBJECT" || user?.role === "FOREMAN"}
              onClick={(e) => {
                e.stopPropagation();
                openSheet("add qunatity", tool);
              }}
            >
              Пополнить
            </DropdownMenuItem>
          )}

          {tool.isBulk && (
            <DropdownMenuItem
              disabled={tool.status !== "ON_OBJECT" || user?.role === "FOREMAN"}
              onClick={(e) => {
                e.stopPropagation();
                openSheet("write off", tool);
              }}
            >
              Списать
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled={user?.role === "FOREMAN"}
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
          >
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Диалог удаления инструмента */}
      <AlertDialogDelete
        isDeleteDialogOpen={isDeleteDialogOpen}
        handleDelete={handleDelete}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        item={tool}
        isLoading={deleteMutation.isPending}
      />

      {/* Диалог комментариев */}
      <ToolCommentDialog
        type={commentDialog.type}
        onClose={() => setCommentDialog({ type: null })}
        tool={tool}
      />
    </>
  );
}
