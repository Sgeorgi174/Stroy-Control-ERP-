import {
  FileText,
  Calendar,
  Clock,
  AlertTriangle,
  ArrowDownToLine,
  MoreHorizontal,
  Pencil,
  Trash2,
  InfinityIcon,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Добавили импорт
import { cn } from "@/lib/utils";
import type { EmployeeDocument } from "@/types/employee";
import { DocumentCommentActions } from "./docment-comment-action";

interface Props {
  doc: EmployeeDocument;
  employeeId: string;
  onDelete: (id: string) => void;
  onEdit: (doc: EmployeeDocument) => void;
}

function getDocumentStatus(doc: EmployeeDocument) {
  if (doc.isIndefinite || !doc.expDate) return "valid";
  const days = Math.ceil(
    (new Date(doc.expDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );
  return days < 0 ? "expired" : days <= 10 ? "expiring" : "valid";
}

export function DocumentItem({ doc, employeeId, onDelete, onEdit }: Props) {
  const status = getDocumentStatus(doc);

  const getValidConfig = () => {
    if (doc.isIndefinite) return { label: "Бессрочно", icon: InfinityIcon };
    return { label: "Действителен", icon: CheckCircle };
  };

  const validCfg = getValidConfig();

  const config = {
    valid: {
      label: validCfg.label,
      icon: validCfg.icon,
      color: "text-success",
      bg: "bg-table-green",
    },
    expiring: {
      label: "Истекает",
      icon: Clock,
      color: "text-warning",
      bg: "bg-table-orange",
    },
    expired: {
      label: "Истёк",
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-table-red",
    },
  }[status];

  const Icon = config.icon;

  return (
    <div className="flex items-center gap-4 rounded-xl border p-4 hover:bg-muted/30 transition-colors">
      <div
        className={cn(
          "h-12 w-12 rounded-lg flex items-center justify-center",
          config.bg,
        )}
      >
        <FileText className={config.color} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium truncate">{doc.name}</span>

          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant="secondary" className="text-[10px] h-5 px-2 py-0">
              <Icon className="mr-1 h-3 w-3" /> {config.label}
            </Badge>

            {doc.comment && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="hover:opacity-70 transition-opacity">
                    <Badge
                      variant="outline"
                      className="text-[10px] h-5 px-1.5 py-0 border-muted-foreground/20 bg-muted/20 cursor-pointer"
                    >
                      <MessageSquare className="h-3 w-3 text-muted-foreground" />
                    </Badge>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 shadow-xl"
                  side="top"
                  align="center"
                >
                  <div className="space-y-2">
                    <p className="text-xs font-semibold  text-muted-foreground uppercase tracking-wider">
                      Заметка
                    </p>
                    <p className="text-sm text-primary break-words leading-relaxed">
                      {doc.comment}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1">
          {doc.isIndefinite ? (
            "Без ограничения срока"
          ) : (
            <>
              <Calendar className="h-3 w-3" /> {doc.expDate}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" asChild>
          <a href={doc.docSrc} download target="_blank" rel="noreferrer">
            <ArrowDownToLine className="h-4 w-4" />
          </a>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => onEdit(doc)}>
              <Pencil className="mr-2 h-4 w-4" /> Редактировать
            </DropdownMenuItem>
            <DocumentCommentActions doc={doc} employeeId={employeeId} />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(doc.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
