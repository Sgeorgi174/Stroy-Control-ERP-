"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ObjectSelectForForms } from "../select-object-for-form";
import { useObjects } from "@/hooks/object/useObject";
import { useAuth } from "@/hooks/auth/useAuth";
import { getAvailableObjects } from "@/lib/utils/getAvailableObjects";
import { CreateWorkLogDeliveriesDialog } from "./create-work-log-deliveries-dialog";
import { Loader2 } from "lucide-react";
import { useMaterialDeliveryArchive } from "@/hooks/material-delivery/useMaterialDelivery";
import { EditWorkLogDeliveriesDialog } from "./edit-work-log-deliveries-dialog";
import { PhotoViewer, usePhotoViewer } from "@/components/ui/photo-viewer";

export function WorkLogPageDeliveries() {
  const [selectedObjectId, setSelectedObjectId] = useState<string>("");

  // Фильтры для архива (текущий месяц по умолчанию)
  const [filters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const { data: user } = useAuth();
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  // Получаем данные с бэкенда
  const { data: deliveries = [], isLoading } = useMaterialDeliveryArchive(
    selectedObjectId,
    filters,
  );

  const availableObjects = getAvailableObjects(user, objects);

  // Подключаем хук вьювера
  const { photos, setPhotos, selectedIndex, isOpen, setIsOpen, openPhoto } =
    usePhotoViewer([]);

  /**
   * При клике на фото формируем галерею из всех фото конкретной строки (доставки)
   * и открываем вьювер на нужном индексе.
   */
  const handleImageClick = (
    logPhotos: { id: string; url: string }[],
    clickedUrl: string,
  ) => {
    const photoItems = logPhotos.map((p) => ({
      src: p.url,
      alt: `Доставка от ${format(new Date(), "dd.MM.yyyy")}`,
    }));

    const index = logPhotos.findIndex((p) => p.url === clickedUrl);

    setPhotos(photoItems);
    openPhoto(index !== -1 ? index : 0);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Журнал по приходу материала</h1>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <ObjectSelectForForms
            objects={availableObjects}
            selectedObjectId={selectedObjectId}
            onSelectChange={(id) => setSelectedObjectId(id || "")}
            className="w-full sm:w-[250px]"
          />

          {selectedObjectId && (
            <CreateWorkLogDeliveriesDialog
              objectId={selectedObjectId}
              existingLogs={deliveries}
            />
          )}
        </div>
      </div>

      {!selectedObjectId ? (
        <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
          Выберите объект, чтобы просмотреть записи
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden bg-background">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[120px]">Дата</TableHead>
                  <TableHead>Фото накладных</TableHead>
                  <TableHead className="w-[200px]">Мастер</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {deliveries.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {format(new Date(log.date), "dd.MM.yyyy")}
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2 flex-wrap">
                        {log.photos.map((photo) => (
                          <img
                            key={photo.id}
                            src={photo.url}
                            alt="Накладная"
                            onClick={() =>
                              handleImageClick(log.photos, photo.url)
                            }
                            className="w-12 h-12 rounded object-cover border cursor-pointer hover:ring-2 ring-primary transition-all"
                          />
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {log.master.firstName} {log.master.lastName}
                    </TableCell>
                    <TableCell>
                      <EditWorkLogDeliveriesDialog
                        objectId={selectedObjectId}
                        delivery={log}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {deliveries.length === 0 && (
            <div className="p-12 text-center text-muted-foreground text-sm">
              Записей за этот месяц пока нет.
            </div>
          )}
        </div>
      )}

      {/* Интегрированный PhotoViewer */}
      <PhotoViewer
        photos={photos}
        open={isOpen}
        onOpenChange={setIsOpen}
        selectedIndex={selectedIndex}
        showThumbnails={photos.length > 1}
        enableDownload={true}
        showNavigation={photos.length > 1}
      />
    </div>
  );
}
