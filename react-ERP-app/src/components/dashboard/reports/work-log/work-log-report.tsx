import { useState } from "react";
import { useWorkLogArchive } from "@/hooks/work-log/useWorkLog";
import { useMaterialDeliveryArchive } from "@/hooks/material-delivery/useMaterialDelivery";
import { useObjects } from "@/hooks/object/useObject";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageIcon, Loader2, Package } from "lucide-react";
import { format } from "date-fns";
import type { Object } from "@/types/object";
import { PhotoViewer } from "@/components/ui/photo-viewer";

const months = [
  { value: "1", label: "Январь" },
  { value: "2", label: "Февраль" },
  { value: "3", label: "Март" },
  { value: "4", label: "Апрель" },
  { value: "5", label: "Май" },
  { value: "6", label: "Июнь" },
  { value: "7", label: "Июль" },
  { value: "8", label: "Август" },
  { value: "9", label: "Сентябрь" },
  { value: "10", label: "Октябрь" },
  { value: "11", label: "Ноябрь" },
  { value: "12", label: "Декабрь" },
];

const years = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { value: String(y), label: String(y) };
});

type LogType = "work-log" | "material-delivery";

interface AppliedFilters {
  objectId: string;
  month: number;
  year: number;
  logType: LogType;
}

export function WorkLogReport() {
  const [selectedObject, setSelectedObject] = useState("");
  const [selectedLog, setSelectedLog] = useState<LogType>("work-log");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(new Date().getMonth() + 1),
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    String(new Date().getFullYear()),
  );

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters | null>(
    null,
  );

  const [viewerOpen, setViewerOpen] = useState(false);
  const [activePhotos, setActivePhotos] = useState<string[]>([]);
  const [initialPhotoIndex, setInitialPhotoIndex] = useState(0);

  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  // Запросы данных
  const { data: workLogs = [], isLoading: isWorkLoading } = useWorkLogArchive(
    appliedFilters?.logType === "work-log" ? appliedFilters.objectId : "",
    { year: appliedFilters?.year || 0, month: appliedFilters?.month || 0 },
  );

  const { data: materialLogs = [], isLoading: isMaterialLoading } =
    useMaterialDeliveryArchive(
      appliedFilters?.logType === "material-delivery"
        ? appliedFilters.objectId
        : "",
      { year: appliedFilters?.year || 0, month: appliedFilters?.month || 0 },
    );

  const isLoading = isWorkLoading || isMaterialLoading;
  const isWorkLog = appliedFilters?.logType === "work-log";

  // Объединяем данные для отрисовки (приводим к общему виду через as any или обрабатываем в рендере)
  const currentLogs = isWorkLog ? workLogs : materialLogs;

  const handleOpenViewer = (photos: { url: string }[], index: number) => {
    // Извлекаем только URL для компонента
    const urls = photos.map((p) => p.url);
    setActivePhotos(urls);
    setInitialPhotoIndex(index);
    setViewerOpen(true);
  };

  const handleApply = () => {
    setAppliedFilters({
      objectId: selectedObject,
      month: Number(selectedMonth),
      year: Number(selectedYear),
      logType: selectedLog,
    });
  };

  return (
    <div className="space-y-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Архив журналов</CardTitle>
          <CardDescription>Выберите объект и тип отчета</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Тип отчета</Label>
              <Select
                value={selectedLog}
                onValueChange={(v: LogType) => setSelectedLog(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work-log">
                    Журнал выполненных работ
                  </SelectItem>
                  <SelectItem value="material-delivery">
                    Журнал прихода материалов
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Объект</Label>
              <Select value={selectedObject} onValueChange={setSelectedObject}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите объект" />
                </SelectTrigger>
                <SelectContent>
                  {objects.map((obj: Object) => (
                    <SelectItem key={obj.id} value={obj.id}>
                      {obj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Месяц</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Год</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y.value} value={y.value}>
                      {y.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleApply}
            disabled={!selectedObject}
            className="w-full md:w-auto"
          >
            Сформировать
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Отчет</CardHeader>
        <CardContent>
          {!appliedFilters ? (
            <div className="text-center py-12 text-muted-foreground">
              Настройте фильтры
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Дата</TableHead>
                    <TableHead>{isWorkLog ? "Работы" : "Информация"}</TableHead>
                    <TableHead className="w-[120px]">Фото</TableHead>
                    <TableHead className="w-[180px]">Мастер</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentLogs.map((log: any) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {format(new Date(log.date), "dd.MM.yyyy")}
                      </TableCell>
                      <TableCell>
                        {/* Описание работ/поставок */}
                        {isWorkLog ? (
                          <ul className="list-disc pl-4 space-y-1">
                            {log.items.map((item: any) => (
                              <li key={item.id} className="text-sm">
                                {item.text}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Package className="h-4 w-4" /> Поставка материалов
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex -space-x-2">
                          {log.photos?.length > 0 ? (
                            log.photos.map((photo: any, index: number) => (
                              <button
                                key={photo.id}
                                type="button"
                                onClick={() =>
                                  handleOpenViewer(log.photos, index)
                                }
                                className="w-8 h-8 rounded-full border-2 border-background overflow-hidden hover:z-10 hover:scale-110 transition-transform focus:outline-none bg-muted"
                              >
                                <img
                                  src={photo.url}
                                  className="w-full h-full object-cover"
                                  alt="Preview"
                                />
                              </button>
                            ))
                          ) : (
                            <ImageIcon className="h-5 w-5 text-muted-foreground/30" />
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-sm">
                        {log.master?.lastName} {log.master?.firstName[0]}.
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {activePhotos.length > 0 && (
        <PhotoViewer
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          photos={activePhotos}
          selectedIndex={initialPhotoIndex}
          showThumbnails={true} // Включил, так как у тебя в коде это круто реализовано
          enableDownload={true}
        />
      )}
    </div>
  );
}
