"use client";

import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";

// ============================================================================
// Types
// ============================================================================

export interface PhotoItem {
  src: string;
  alt?: string;
  thumbnail?: string;
}

export interface PhotoViewerProps {
  /** Single photo URL or array of photos */
  photos: string | string[] | PhotoItem | PhotoItem[];
  /** Currently selected photo index */
  selectedIndex?: number;
  /** Whether the viewer is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback when selected photo changes */
  onIndexChange?: (index: number) => void;
  /** Initial zoom level (1 = 100%) */
  initialZoom?: number;
  /** Minimum zoom level */
  minZoom?: number;
  /** Maximum zoom level */
  maxZoom?: number;
  /** Zoom step for buttons */
  zoomStep?: number;
  /** Enable keyboard navigation */
  enableKeyboard?: boolean;
  /** Enable touch gestures */
  enableGestures?: boolean;
  /** Show toolbar */
  showToolbar?: boolean;
  /** Show navigation arrows */
  showNavigation?: boolean;
  /** Show thumbnails strip */
  showThumbnails?: boolean;
  /** Enable download button */
  enableDownload?: boolean;
  /** Custom class name */
  className?: string;
  /** Labels for localization */
  labels?: Partial<PhotoViewerLabels>;
}

interface PhotoViewerLabels {
  close: string;
  rotateLeft: string;
  rotateRight: string;
  zoomIn: string;
  zoomOut: string;
  resetZoom: string;
  previous: string;
  next: string;
  download: string;
  fullscreen: string;
  imageOf: string;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_LABELS: PhotoViewerLabels = {
  close: "Закрыть",
  rotateLeft: "Повернуть влево",
  rotateRight: "Повернуть вправо",
  zoomIn: "Увеличить",
  zoomOut: "Уменьшить",
  resetZoom: "Сбросить масштаб",
  previous: "Предыдущее",
  next: "Следующее",
  download: "Скачать",
  fullscreen: "Полный экран",
  imageOf: "из",
};

// ============================================================================
// Hooks
// ============================================================================

function usePhotoState(initialZoom: number, minZoom: number, maxZoom: number) {
  const [zoom, setZoom] = useState(initialZoom);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const reset = useCallback(() => {
    setZoom(initialZoom);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, [initialZoom]);

  const zoomIn = useCallback(
    (step: number) => {
      setZoom((prev) => Math.min(prev + step, maxZoom));
    },
    [maxZoom],
  );

  const zoomOut = useCallback(
    (step: number) => {
      setZoom((prev) => Math.max(prev - step, minZoom));
    },
    [minZoom],
  );

  const setZoomLevel = useCallback(
    (level: number) => {
      setZoom(Math.min(Math.max(level, minZoom), maxZoom));
    },
    [minZoom, maxZoom],
  );

  const rotateLeft = useCallback(() => {
    setRotation((prev) => (prev - 90) % 360);
  }, []);

  const rotateRight = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  return {
    zoom,
    rotation,
    position,
    setPosition,
    reset,
    zoomIn,
    zoomOut,
    setZoomLevel,
    rotateLeft,
    rotateRight,
  };
}

function useGestures(
  containerRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
  {
    onZoom,
    onPan,
    zoom,
  }: {
    onZoom: (delta: number) => void;
    onPan: (delta: { x: number; y: number }) => void;
    zoom: number;
  },
) {
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const lastDistanceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      onZoom(delta);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        lastTouchRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastDistanceRef.current = Math.hypot(dx, dy);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();

      if (e.touches.length === 1 && lastTouchRef.current && zoom > 1) {
        const deltaX = e.touches[0].clientX - lastTouchRef.current.x;
        const deltaY = e.touches[0].clientY - lastTouchRef.current.y;
        onPan({ x: deltaX, y: deltaY });
        lastTouchRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else if (e.touches.length === 2 && lastDistanceRef.current) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.hypot(dx, dy);
        const delta = (distance - lastDistanceRef.current) * 0.01;
        onZoom(delta);
        lastDistanceRef.current = distance;
      }
    };

    const handleTouchEnd = () => {
      lastTouchRef.current = null;
      lastDistanceRef.current = null;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enabled, containerRef, onZoom, onPan, zoom]);
}

function useDrag(
  enabled: boolean,
  zoom: number,
  onDrag: (delta: { x: number; y: number }) => void,
) {
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || zoom <= 1) return;
      isDraggingRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    },
    [enabled, zoom],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - lastPosRef.current.x;
      const deltaY = e.clientY - lastPosRef.current.y;
      onDrag({ x: deltaX, y: deltaY });
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    },
    [onDrag],
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  return {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseUp,
  };
}

// ============================================================================
// Utilities
// ============================================================================

function normalizePhotos(
  photos: string | string[] | PhotoItem | PhotoItem[],
): PhotoItem[] {
  if (typeof photos === "string") {
    return [{ src: photos }];
  }
  if (Array.isArray(photos)) {
    return photos.map((photo) =>
      typeof photo === "string" ? { src: photo } : photo,
    );
  }
  return [photos];
}

function downloadImage(url: string, filename?: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || url.split("/").pop() || "image";
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============================================================================
// Sub-components
// ============================================================================

interface ToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onDownload?: () => void;
  onFullscreen?: () => void;
  onClose: () => void;
  labels: PhotoViewerLabels;
  enableDownload: boolean;
}

const Toolbar = React.memo(function Toolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onRotateLeft,
  onRotateRight,
  onDownload,
  onClose,
  labels,
  enableDownload,
}: ToolbarProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-lg bg-black/70 p-1.5 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomOut}
        title={labels.zoomOut}
        className="text-white hover:bg-white/20"
      >
        <ZoomOut className="size-4" />
      </Button>

      <button
        onClick={onResetZoom}
        className="min-w-[3.5rem] px-2 py-1 text-xs text-white hover:bg-white/20 rounded transition-colors"
        title={labels.resetZoom}
      >
        {Math.round(zoom * 100)}%
      </button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomIn}
        title={labels.zoomIn}
        className="text-white hover:bg-white/20"
      >
        <ZoomIn className="size-4" />
      </Button>

      <div className="mx-1 h-4 w-px bg-white/30" />

      <Button
        variant="ghost"
        size="sm"
        onClick={onRotateLeft}
        title={labels.rotateLeft}
        className="text-white hover:bg-white/20"
      >
        <RotateCcw className="size-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onRotateRight}
        title={labels.rotateRight}
        className="text-white hover:bg-white/20"
      >
        <RotateCw className="size-4" />
      </Button>

      {enableDownload && onDownload && (
        <>
          <div className="mx-1 h-4 w-px bg-white/30" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownload}
            title={labels.download}
            className="text-white hover:bg-white/20"
          >
            <Download className="size-4" />
          </Button>
        </>
      )}

      <div className="mx-1 h-4 w-px bg-white/30" />

      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        title={labels.close}
        className="text-white hover:bg-white/20"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
});

interface NavigationArrowsProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  labels: PhotoViewerLabels;
}

const NavigationArrows = React.memo(function NavigationArrows({
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  labels,
}: NavigationArrowsProps) {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        disabled={!hasPrevious}
        title={labels.previous}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none size-10"
      >
        <ChevronLeft className="size-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={!hasNext}
        title={labels.next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none size-10"
      >
        <ChevronRight className="size-6" />
      </Button>
    </>
  );
});

interface ThumbnailStripProps {
  photos: PhotoItem[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

const ThumbnailStrip = React.memo(function ThumbnailStrip({
  photos,
  currentIndex,
  onSelect,
}: ThumbnailStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stripRef.current) {
      const activeThumb = stripRef.current.children[
        currentIndex
      ] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentIndex]);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 max-w-[80vw]">
      <div
        ref={stripRef}
        className="flex gap-2 overflow-x-auto p-2 rounded-lg bg-black/70 backdrop-blur-sm scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {photos.map((photo, index) => (
          <button
            key={`${photo.src}-${index}`}
            onClick={() => onSelect(index)}
            className={cn(
              "flex-shrink-0 size-12 rounded overflow-hidden border-2 transition-all",
              index === currentIndex
                ? "border-white opacity-100 scale-110"
                : "border-transparent opacity-60 hover:opacity-100",
            )}
          >
            <img
              src={photo.thumbnail || photo.src}
              alt={photo.alt || `Thumbnail ${index + 1}`}
              className="size-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
});

interface PhotoCounterProps {
  current: number;
  total: number;
  label: string;
}

const PhotoCounter = React.memo(function PhotoCounter({
  current,
  total,
  label,
}: PhotoCounterProps) {
  return (
    <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm text-white text-sm">
      {current} {label} {total}
    </div>
  );
});

// ============================================================================
// Main Component
// ============================================================================

export function PhotoViewer({
  photos,
  selectedIndex = 0,
  open,
  onOpenChange,
  onIndexChange,
  initialZoom = 1,
  minZoom = 0.25,
  maxZoom = 4,
  zoomStep = 0.25,
  enableKeyboard = true,
  enableGestures = true,
  showToolbar = true,
  showNavigation = true,
  showThumbnails = false,
  enableDownload = false,
  className,
  labels: customLabels,
}: PhotoViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [isLoading, setIsLoading] = useState(true);

  const labels = useMemo(
    () => ({ ...DEFAULT_LABELS, ...customLabels }),
    [customLabels],
  );

  const normalizedPhotos = useMemo(() => normalizePhotos(photos), [photos]);
  const currentPhoto = normalizedPhotos[currentIndex];
  const hasMultiplePhotos = normalizedPhotos.length > 1;

  const {
    zoom,
    rotation,
    position,
    setPosition,
    reset,
    zoomIn,
    zoomOut,
    rotateLeft,
    rotateRight,
  } = usePhotoState(initialZoom, minZoom, maxZoom);

  // Reset state when photo changes
  useEffect(() => {
    reset();
    setIsLoading(true);
  }, [currentIndex, reset]);

  // Sync with external selectedIndex
  useEffect(() => {
    setCurrentIndex(selectedIndex);
  }, [selectedIndex]);

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    const newIndex =
      currentIndex > 0 ? currentIndex - 1 : normalizedPhotos.length - 1;
    setCurrentIndex(newIndex);
    onIndexChange?.(newIndex);
  }, [currentIndex, normalizedPhotos.length, onIndexChange]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex < normalizedPhotos.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onIndexChange?.(newIndex);
  }, [currentIndex, normalizedPhotos.length, onIndexChange]);

  const goToIndex = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      onIndexChange?.(index);
    },
    [onIndexChange],
  );

  // Gesture handlers
  const handleZoom = useCallback(
    (delta: number) => {
      if (delta > 0) {
        zoomIn(Math.abs(delta));
      } else {
        zoomOut(Math.abs(delta));
      }
    },
    [zoomIn, zoomOut],
  );

  const handlePan = useCallback(
    (delta: { x: number; y: number }) => {
      setPosition((prev) => ({
        x: prev.x + delta.x,
        y: prev.y + delta.y,
      }));
    },
    [setPosition],
  );

  useGestures(containerRef, enableGestures, {
    onZoom: handleZoom,
    onPan: handlePan,
    zoom,
  });

  const dragHandlers = useDrag(enableGestures, zoom, handlePan);

  // Keyboard navigation
  useEffect(() => {
    if (!open || !enableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "ArrowUp":
        case "+":
        case "=":
          e.preventDefault();
          zoomIn(zoomStep);
          break;
        case "ArrowDown":
        case "-":
          e.preventDefault();
          zoomOut(zoomStep);
          break;
        case "r":
          rotateRight();
          break;
        case "R":
          rotateLeft();
          break;
        case "0":
          reset();
          break;
        case "Escape":
          onOpenChange(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    open,
    enableKeyboard,
    goToPrevious,
    goToNext,
    zoomIn,
    zoomOut,
    zoomStep,
    rotateLeft,
    rotateRight,
    reset,
    onOpenChange,
  ]);

  // Download handler
  const handleDownload = useCallback(() => {
    if (currentPhoto) {
      downloadImage(currentPhoto.src);
    }
  }, [currentPhoto]);

  // Close handler
  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  // Image transform style
  const imageStyle = useMemo(
    () => ({
      transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom})`,
      cursor: zoom > 1 ? "grab" : "default",
    }),
    [position.x, position.y, rotation, zoom],
  );

  if (!currentPhoto) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/95" />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center focus:outline-none",
            className,
          )}
        >
          {/* Thumbnails at top */}
          {showThumbnails && hasMultiplePhotos && (
            <ThumbnailStrip
              photos={normalizedPhotos}
              currentIndex={currentIndex}
              onSelect={goToIndex}
            />
          )}

          {/* Photo counter (when no thumbnails) */}
          {!showThumbnails && hasMultiplePhotos && (
            <PhotoCounter
              current={currentIndex + 1}
              total={normalizedPhotos.length}
              label={labels.imageOf}
            />
          )}

          {/* Navigation arrows */}
          {showNavigation && hasMultiplePhotos && (
            <NavigationArrows
              onPrevious={goToPrevious}
              onNext={goToNext}
              hasPrevious={true}
              hasNext={true}
              labels={labels}
            />
          )}

          {/* Image container */}
          <div
            ref={containerRef}
            className="relative flex items-center justify-center w-full h-full overflow-hidden select-none"
            {...dragHandlers}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}

            <img
              src={currentPhoto.src}
              alt={currentPhoto.alt || "Photo"}
              style={imageStyle}
              className={cn(
                "max-h-[85vh] max-w-[90vw] object-contain transition-transform duration-150 select-none",
                isLoading && "opacity-0",
              )}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              draggable={false}
            />
          </div>

          {/* Toolbar */}
          {showToolbar && (
            <Toolbar
              zoom={zoom}
              onZoomIn={() => zoomIn(zoomStep)}
              onZoomOut={() => zoomOut(zoomStep)}
              onResetZoom={reset}
              onRotateLeft={rotateLeft}
              onRotateRight={rotateRight}
              onDownload={handleDownload}
              onClose={handleClose}
              labels={labels}
              enableDownload={enableDownload}
            />
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

// ============================================================================
// Hook for easy usage
// ============================================================================

export function usePhotoViewer(initialPhotos?: PhotoItem[] | string[]) {
  const [photos, setPhotos] = useState<PhotoItem[]>(
    normalizePhotos(initialPhotos || []),
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const openPhoto = useCallback((index: number = 0) => {
    setSelectedIndex(index);
    setIsOpen(true);
  }, []);

  const closePhoto = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    photos,
    setPhotos,
    selectedIndex,
    setSelectedIndex,
    isOpen,
    setIsOpen,
    openPhoto,
    closePhoto,
  };
}
