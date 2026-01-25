"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";

import {
  FileText,
  Plus,
  Upload,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowDownToLine,
  MoreHorizontal,
  Trash2,
  X,
} from "lucide-react";

import type { Employee, EmployeeDocument } from "@/types/employee";
import type { UploadEmployeeDocumentDto } from "@/types/dto/employee.dto";

import { useUploadEmployeeDocument } from "@/hooks/employee/useUploadEmployeeDocument";
import { useEmployeeDocuments } from "@/hooks/employee/useEmployeeDocuments";
import { useRemoveEmployeeDocument } from "@/hooks/employee/useRemoveEmployeeDocument";

/* ---------------- utils ---------------- */

function getDocumentStatus(expDate: string | null) {
  if (!expDate) return "valid";

  const exp = new Date(expDate);
  const now = new Date();
  const days = Math.ceil(
    (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (days < 0) return "expired";
  if (days <= 10) return "expiring";
  return "valid";
}

/* ---------------- DropZone ---------------- */

function DropZone({
  onFileSelect,
  isDragging,
  setIsDragging,
}: {
  onFileSelect: (file: File) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
}) {
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect, setIsDragging],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:bg-muted/50",
      )}
    >
      <Upload className="h-6 w-6 text-muted-foreground" />
      <p className="mt-3 text-sm font-medium">Перетащите файл</p>
      <p className="text-xs text-muted-foreground">или нажмите для выбора</p>

      <input
        type="file"
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
      />
    </div>
  );
}

/* ---------------- DocumentItem ---------------- */

function DocumentItem({
  doc,
  onDelete,
}: {
  doc: EmployeeDocument;
  onDelete: (id: string) => void;
}) {
  const status = getDocumentStatus(doc.expDate);

  const map = {
    valid: {
      label: "Действителен",
      icon: CheckCircle2,
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
  };

  const cfg = map[status];
  const Icon = cfg.icon;

  return (
    <div className="group flex items-center gap-4 rounded-xl border p-4">
      <div
        className={cn(
          "h-12 w-12 rounded-lg flex items-center justify-center",
          cfg.bg,
        )}
      >
        <FileText className={cfg.color} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{doc.name}</span>
          <Badge variant="secondary" className="text-xs">
            <Icon className="mr-1 h-3 w-3" />
            {cfg.label}
          </Badge>
        </div>

        {doc.expDate && (
          <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Срок: {doc.expDate}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <a href={doc.docSrc} download target="_blank">
                  <ArrowDownToLine className="h-4 w-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Скачать</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(doc.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

/* ---------------- Main ---------------- */

export function EmployeeDocumentsBox({ employee }: { employee: Employee }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [expDate, setExpDate] = useState<string | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: documents = [], isLoading } = useEmployeeDocuments(employee.id);
  const { mutate: upload } = useUploadEmployeeDocument(employee.id);
  const { mutate: remove } = useRemoveEmployeeDocument(employee.id);

  const handleUpload = () => {
    if (!file || !name) return;

    upload({
      file,
      data: { name, expDate } as UploadEmployeeDocumentDto,
    });

    setOpen(false);
    setFile(null);
    setName("");
    setExpDate(undefined);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Документы</CardTitle>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Добавить
              </Button>
            </DialogTrigger>

            <DialogContent className="min-w-[650px]">
              <DialogHeader>
                <DialogTitle>Добавить документ</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {!file ? (
                  <DropZone
                    onFileSelect={setFile}
                    isDragging={false}
                    setIsDragging={() => {}}
                  />
                ) : (
                  <div className="flex items-center gap-3 border rounded-lg p-3">
                    <FileText />
                    <span className="flex-1 truncate">{file.name}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Label>Название</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Дата окончания</Label>
                  <DatePicker selected={expDate} onSelect={setExpDate} />
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleUpload} disabled={!file || !name}>
                  Добавить
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Загрузка…</div>
        ) : documents.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            Нет документов
          </div>
        ) : (
          documents.map((doc) => (
            <DocumentItem
              key={doc.id}
              doc={doc}
              onDelete={(id) => setDeleteId(id)}
            />
          ))
        )}
      </CardContent>

      {/* confirm delete */}
      <Dialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить документ?</DialogTitle>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteId) remove(deleteId);
                setDeleteId(null);
              }}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
