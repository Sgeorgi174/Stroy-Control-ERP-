import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function PhotoViewerDialog({
  src,
  open,
  onClose,
}: {
  src: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [rotation, setRotation] = useState(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const rotateLeft = () => setRotation((prev) => prev - 90);
  const rotateRight = () => setRotation((prev) => prev + 90);

  useEffect(() => {
    if (!src) {
      setRotation(0);
    }
  }, [src]);

  useEffect(() => {
    // Растягиваем контейнер почти на весь экран
    setContainerHeight(window.innerHeight * 0.85); // 85% высоты экрана
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-[90vw] max-w-none p-4 flex flex-col items-center justify-center gap-4"
        style={{ height: containerHeight + 60 }} // под кнопки оставляем место
      >
        {src && (
          <>
            <div
              className="flex justify-center items-center w-full"
              style={{ height: containerHeight }}
            >
              <img
                src={src}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  maxHeight: "100%",
                  maxWidth: "100%",
                }}
                className="object-contain transition-transform"
              />
            </div>

            <div className="flex gap-4 mt-2">
              <Button onClick={rotateLeft}>⟲ Повернуть влево</Button>
              <Button onClick={rotateRight}>⟳ Повернуть вправо</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
