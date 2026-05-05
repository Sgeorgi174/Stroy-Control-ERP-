import { useState, useRef } from "react";
import { Upload } from "lucide-react";

export function DocumentDropZone({
  onFileSelect,
}: {
  onFileSelect: (file: File) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent, dragging: boolean) => {
    e.preventDefault();
    setIsDragging(dragging);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) onFileSelect(e.dataTransfer.files[0]);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-muted-foreground/25 hover:border-muted-foreground/40 hover:bg-muted/50"
      }`}
    >
      <Upload
        className={`h-6 w-6 ${isDragging ? "text-primary" : "text-muted-foreground"}`}
      />
      <div className="text-center">
        <p className="text-sm font-medium">Перетащите файл сюда</p>
        <p className="text-xs text-muted-foreground mt-1">
          или нажмите для выбора
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
      />
    </div>
  );
}
