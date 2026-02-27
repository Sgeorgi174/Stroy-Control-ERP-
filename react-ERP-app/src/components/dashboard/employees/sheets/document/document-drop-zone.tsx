import { useCallback } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onFileSelect: (file: File) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
}

export function DocumentDropZone({
  onFileSelect,
  isDragging,
  setIsDragging,
}: Props) {
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
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all duration-200",
        isDragging
          ? "border-primary bg-primary/10 scale-[1.02] shadow-sm"
          : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50",
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm transition-transform",
          isDragging && "scale-110",
        )}
      >
        <Upload
          className={cn(
            "h-6 w-6",
            isDragging ? "text-primary" : "text-muted-foreground",
          )}
        />
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm font-semibold text-foreground">
          Нажмите для загрузки или перетащите файл
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PDF, PNG, JPG (макс. 10MB)
        </p>
      </div>
      <input
        type="file"
        className="absolute inset-0 cursor-pointer opacity-0"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />
    </div>
  );
}
