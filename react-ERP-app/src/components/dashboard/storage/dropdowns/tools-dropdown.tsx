import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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

type ToolDropDownProps = { tool: Tool };

export function ToolsDropDown({ tool }: ToolDropDownProps) {
  const { openSheet } = useToolsSheetStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

          <DropdownMenuSeparator />

          {!tool.isBag ? (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                openSheet("edit", tool);
              }}
            >
              Редактировать
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                openSheet("edit bag", tool);
              }}
            >
              Редактировать сумку
            </DropdownMenuItem>
          )}

          {tool.isBulk && (
            <DropdownMenuItem
              disabled={tool.status !== "ON_OBJECT"}
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
              disabled={tool.status !== "ON_OBJECT"}
              onClick={(e) => {
                e.stopPropagation();
                openSheet("write off", tool);
              }}
            >
              Списать
            </DropdownMenuItem>
          )}

          {!tool.isBulk && (
            <DropdownMenuItem
              disabled={tool.status !== "ON_OBJECT"}
              onClick={(e) => {
                e.stopPropagation();
                openSheet("transfer", tool);
              }}
            >
              Переместить
            </DropdownMenuItem>
          )}

          {!tool.isBulk && (
            <DropdownMenuItem
              disabled={
                tool.status === "IN_TRANSIT" ||
                tool.status === "LOST" ||
                tool.status === "WRITTEN_OFF"
              }
              onClick={(e) => {
                e.stopPropagation();
                openSheet("change status", tool);
              }}
            >
              Сменить статус
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Группа комментариев */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Комментарий</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setCommentDialog({ type: "add" });
                  }}
                >
                  Добавить
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={tool.comment ? false : true}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCommentDialog({ type: "edit" });
                  }}
                >
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={tool.comment ? false : true}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCommentDialog({ type: "delete" });
                  }}
                >
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem
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
