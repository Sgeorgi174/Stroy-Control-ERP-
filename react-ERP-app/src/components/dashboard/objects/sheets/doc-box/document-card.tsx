import {
  FileText,
  User,
  Calendar,
  MoreVertical,
  Pencil,
  Trash2,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ObjectDocument } from "@/types/object-document";
import { DOC_TYPE_LABELS, getDocTypeBadgeClass } from "./object-document-conts";

interface DocumentCardProps {
  doc: ObjectDocument;
  onEdit: (doc: ObjectDocument) => void;
  onDelete: (id: string) => void;
}

export function DocumentCard({ doc, onEdit, onDelete }: DocumentCardProps) {
  const allItems = [...(doc.tools || []), ...(doc.devices || [])];

  return (
    <div
      onClick={() => doc.fileUrl && window.open(doc.fileUrl, "_blank")}
      className="group relative flex flex-col gap-3 p-4 bg-card border rounded-xl transition-all hover:shadow-md hover:border-foreground/10 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium truncate">{doc.name}</h4>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>
                {`${doc.master?.lastName || ""} ${doc.master?.firstName || ""}`.trim() ||
                  "Не указан"}
              </span>
              <span className="text-muted-foreground/50">·</span>
              <Calendar className="h-3 w-3" />
              <span>{new Date(doc.createdAt).toLocaleDateString("ru-RU")}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getDocTypeBadgeClass(doc.type)}>
            {DOC_TYPE_LABELS[doc.type]}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(doc);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" /> Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(doc.id);
                }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {doc.comment && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {doc.comment}
        </p>
      )}

      {allItems.length > 0 && (
        <div className="flex items-center gap-2 pt-2 border-t">
          <Package className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            {allItems.slice(0, 3).map((item) => (
              <Badge key={item.id} variant="secondary" className="text-xs">
                {item.name}
              </Badge>
            ))}
            {allItems.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{allItems.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
