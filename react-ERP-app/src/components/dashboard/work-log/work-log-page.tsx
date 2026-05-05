"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWorkLogArchive } from "@/hooks/work-log/useWorkLog";
import { ObjectSelectForForms } from "../select-object-for-form";
import { CreateWorkLogDialog } from "./create-work-log-dialog";
import { useObjects } from "@/hooks/object/useObject";
import { useAuth } from "@/hooks/auth/useAuth";
import { getAvailableObjects } from "@/lib/utils/getAvailableObjects";
import { EditWorkLogDialog } from "./edit-work-log-dialog";
import { PhotoViewer, usePhotoViewer } from "@/components/ui/photo-viewer";

export function WorkLogPage() {
  const [selectedObjectId, setSelectedObjectId] = useState<string>("");
  const [currentDate] = useState(new Date());
  const { data: user } = useAuth();

  const { data: logs, isLoading } = useWorkLogArchive(selectedObjectId, {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  });

  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const availableObjects = getAvailableObjects(user, objects);

  // Подключаем хук вьювера
  const { photos, setPhotos, selectedIndex, isOpen, setIsOpen, openPhoto } =
    usePhotoViewer([]);

  // Обработчик клика по фото
  const handleImageClick = (
    logPhotos: { id: string; url: string }[],
    clickedUrl: string,
  ) => {
    const photoItems = logPhotos.map((p) => ({
      src: p.url,
      alt: "Фото выполненных работ",
    }));

    const index = logPhotos.findIndex((p) => p.url === clickedUrl);

    setPhotos(photoItems);
    openPhoto(index !== -1 ? index : 0);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Журнал выполненных работ</h1>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <ObjectSelectForForms
            objects={availableObjects}
            selectedObjectId={selectedObjectId}
            onSelectChange={(id) => setSelectedObjectId(id || "")}
            className="w-full sm:w-[250px]"
          />
          {selectedObjectId && (
            <CreateWorkLogDialog
              objectId={selectedObjectId}
              existingLogs={logs || []}
            />
          )}
        </div>
      </div>

      {!selectedObjectId ? (
        <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
          Выберите объект, чтобы просмотреть или создать записи в журнале
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden bg-muted">
          {/* Десктопная версия */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Дата</TableHead>
                  <TableHead>Описание работ</TableHead>
                  <TableHead className="w-[150px]">Фото</TableHead>
                  <TableHead className="w-[180px]">Мастер</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {format(new Date(log.date), "dd.MM.yyyy")}
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc pl-4 space-y-1">
                        {log.items.map((item) => (
                          <li key={item.id} className="text-sm">
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {log.photos?.map((photo) => (
                          <div
                            key={photo.id}
                            onClick={() =>
                              handleImageClick(log.photos, photo.url)
                            }
                            className="w-10 h-10 rounded border overflow-hidden hover:ring-2 ring-primary transition-all cursor-pointer"
                          >
                            <img
                              src={photo.url}
                              alt="work"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {log.master.lastName} {log.master.firstName}
                    </TableCell>
                    <TableCell>
                      <EditWorkLogDialog
                        objectId={selectedObjectId}
                        log={log}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Мобильный список */}
          <div className="md:hidden flex flex-col divide-y">
            {logs?.map((log) => (
              <div key={log.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-lg">
                    {format(new Date(log.date), "dd MMMM", { locale: ru })}
                  </span>
                  <div className="flex items-center gap-2">
                    <EditWorkLogDialog objectId={selectedObjectId} log={log} />
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] bg-muted px-2 py-0.5 rounded uppercase font-semibold">
                        {log.master.lastName}
                      </span>
                      {log.photos.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {log.photos.map((p) => (
                            <img
                              key={p.id}
                              src={p.url}
                              onClick={() =>
                                handleImageClick(log.photos, p.url)
                              }
                              className="w-6 h-6 rounded object-cover border cursor-pointer"
                              alt="thumbnail"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <ul className="space-y-2">
                  {log.items.map((item) => (
                    <li
                      key={item.id}
                      className="text-sm border-l-2 border-primary/30 pl-3"
                    >
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {logs?.length === 0 && !isLoading && (
            <div className="p-12 text-center text-muted-foreground text-sm">
              Записей за этот месяц пока нет.
            </div>
          )}
        </div>
      )}

      {/* Компонент просмотра фото */}
      <PhotoViewer
        photos={photos}
        open={isOpen}
        onOpenChange={setIsOpen}
        selectedIndex={selectedIndex}
        showThumbnails={photos.length > 1}
        enableDownload={true}
      />
    </div>
  );
}
