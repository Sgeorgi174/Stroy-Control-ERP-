import { useState } from "react";
import { MessageSquare, Send, Edit2, Trash2, X, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils/format-date";
import {
  useAddComment,
  useCommentsByRequest,
  useDeleteComment,
  useUpdateComment,
} from "@/hooks/clothes-request/useClothesRequest";
import { Textarea } from "@/components/ui/textarea";

interface CommentsPopoverProps {
  requestId: string;
}

export function CommentsPopover({ requestId }: CommentsPopoverProps) {
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Твои хуки
  const { data: comments = [], isLoading } = useCommentsByRequest(requestId);
  const addMutation = useAddComment(requestId);
  const updateMutation = useUpdateComment(requestId);
  const deleteMutation = useDeleteComment(requestId);

  const handleSend = () => {
    if (!newComment.trim()) return;
    addMutation.mutate(newComment, {
      onSuccess: () => setNewComment(""),
    });
  };

  const handleStartEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleUpdate = (id: string) => {
    if (!editText.trim()) return;
    updateMutation.mutate(
      { commentId: id, text: editText },
      {
        onSuccess: () => setEditingId(null),
      },
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-4 cursor-pointer">
          <MessageSquare className="w-4 h-4" />
          Комментарии
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="end">
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-muted/30">
            <h4 className="font-semibold text-sm">Комментарии к заявке</h4>
          </div>

          {/* Chat Area */}
          <ScrollArea className="flex-1 p-4 max-h-[300px] min-h-[300px] overflow-auto">
            {isLoading ? (
              <p className="text-center text-sm text-muted-foreground mt-10">
                Загрузка...
              </p>
            ) : comments.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground mt-10">
                Нет комментариев
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="group flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">
                        {comment.createdBy.firstName}{" "}
                        {comment.createdBy.lastName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>

                    <div className="relative bg-secondary p-3 rounded-lg text-sm">
                      {editingId === comment.id ? (
                        <div className="flex flex-col gap-2">
                          <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="bg-background h-8"
                            autoFocus
                          />
                          <div className="flex justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => setEditingId(null)}
                            >
                              <X className="h-3 w-3 text-destructive" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => handleUpdate(comment.id)}
                            >
                              <Check className="h-3 w-3 text-green-600" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="whitespace-pre-wrap break-words">
                            {comment.text}
                          </p>
                          {/* Actions appearing on hover */}
                          {!comment.isSystemComment && (
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity bg-secondary/80 backdrop-blur-sm rounded">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  handleStartEdit(comment.id, comment.text)
                                }
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive"
                                onClick={() =>
                                  deleteMutation.mutate(comment.id)
                                }
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Textarea
                className="max-h-[150px]"
                placeholder="Напишите комментарий..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={addMutation.isPending || !newComment.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
