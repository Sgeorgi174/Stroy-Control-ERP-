import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Trash2,
  Loader2,
  X,
  GripHorizontal,
} from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils/format-date";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
  useAddPenaltyComment,
  useDeletePenaltyComment,
  usePenaltyComments,
} from "@/hooks/penalties/usePenalties";
import type { RequestPenaltyComment } from "@/types/penalty";

interface Props {
  penaltyId: string;
  penaltyName: string;
}

export function PenaltyCommentsWindow({ penaltyId, penaltyName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Реф для контейнера, в пределах которого можно двигать окно
  const constraintsRef = useRef(null);
  const dragControls = useDragControls();

  const { data: comments = [], isLoading } = usePenaltyComments(penaltyId);
  const addMutation = useAddPenaltyComment(penaltyId);
  const deleteMutation = useDeletePenaltyComment(penaltyId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments.length, isOpen]);

  const handleSend = () => {
    const trimmed = newComment.trim();
    if (!trimmed || addMutation.isPending) return;
    addMutation.mutate(trimmed, { onSuccess: () => setNewComment("") });
  };

  return (
    <>
      {/* Контейнер-ограничитель на весь экран */}
      <div
        ref={constraintsRef}
        className="fixed inset-0 pointer-events-none z-[998]"
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="relative h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
      >
        <MessageSquare className="h-4 w-4" />
        {comments.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground shadow-sm">
            {comments.length}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            // Ограничиваем движение пределами вьюпорта
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            className="fixed bottom-20 right-20 z-[999] w-[420px] h-[550px] flex flex-col bg-card border rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
          >
            {/* Header (Drag Handle) */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="p-3 border-b bg-muted/50 flex items-center justify-between cursor-grab active:cursor-grabbing select-none flex-shrink-0"
            >
              <div className="flex items-center gap-2">
                <GripHorizontal className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-sm">
                  Комментарии к штрафу ({penaltyName})
                </h4>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content Area */}
            <ScrollArea className="flex-1 overflow-y-auto bg-card">
              <div className="p-4 space-y-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <p className="text-xs">Загрузка истории...</p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 opacity-50">
                    <MessageSquare className="h-8 w-8 mb-2" />
                    <p className="text-sm">Обсуждений пока нет</p>
                  </div>
                ) : (
                  comments.map((comment: RequestPenaltyComment) => (
                    <div key={comment.id} className="group flex flex-col gap-1">
                      <div className="flex items-center justify-between px-1">
                        <span
                          className={cn(
                            "text-[11px] font-bold",
                            comment.isSystemComment
                              ? "text-blue-600"
                              : "text-foreground/80",
                          )}
                        >
                          {comment.isSystemComment
                            ? "Система"
                            : `${comment.createdBy?.firstName} ${comment.createdBy?.lastName}`}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "relative p-3 rounded-lg text-sm border shadow-sm transition-colors",
                          comment.isSystemComment
                            ? "bg-blue-50/50 border-blue-100 italic text-blue-900"
                            : "bg-secondary/50 border-transparent group-hover:border-muted-foreground/20",
                        )}
                      >
                        <p className="whitespace-pre-wrap break-words leading-relaxed">
                          {comment.text}
                        </p>
                        {!comment.isSystemComment && (
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:bg-destructive/10"
                              onClick={() => deleteMutation.mutate(comment.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input Footer */}
            <div className="p-4 border-t bg-background flex-shrink-0">
              <div className="flex gap-2 items-end">
                <Textarea
                  className="max-h-[120px] min-h-[44px] text-sm resize-none bg-muted/10 focus-visible:ring-1"
                  placeholder="Напишите комментарий..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={addMutation.isPending}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={addMutation.isPending || !newComment.trim()}
                  className="flex-shrink-0 shadow-md"
                >
                  {addMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
