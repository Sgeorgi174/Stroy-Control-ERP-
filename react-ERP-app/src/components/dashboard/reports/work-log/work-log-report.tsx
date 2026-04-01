import { useState } from "react";
import { useWorkLogArchive } from "@/hooks/work-log/useWorkLog";
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
import { Loader2, FileText } from "lucide-react";
import { format } from "date-fns";
import type { Object } from "@/types/object";

// Используем константы из родительского файла или выносим в общий конфиг
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

export function WorkLogReport() {
  const [selectedObject, setSelectedObject] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(new Date().getMonth() + 1),
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    String(new Date().getFullYear()),
  );

  const [appliedFilters, setAppliedFilters] = useState<{
    objectId: string;
    month: number;
    year: number;
  } | null>(null);

  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const { data: logs = [], isLoading } = useWorkLogArchive(
    appliedFilters?.objectId || "",
    { year: appliedFilters?.year || 0, month: appliedFilters?.month || 0 },
  );

  const handleApply = () => {
    setAppliedFilters({
      objectId: selectedObject,
      month: Number(selectedMonth),
      year: Number(selectedYear),
    });
  };

  return (
    <div className="space-y-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Фильтры журналов</CardTitle>
          <CardDescription>
            Просмотр выполненных работ по объектам
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            Сформировать список работ
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Журнал выполненных работ</CardTitle>
            <CardDescription>Детализация по дням</CardDescription>
          </div>
          {appliedFilters && logs.length > 0 && (
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" /> Экспорт (в разработке)
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!appliedFilters ? (
            <div className="text-center py-12 text-muted-foreground">
              Выберите объект и период
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Нет записей за выбранный период
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Дата</TableHead>
                    <TableHead>Работы</TableHead>
                    <TableHead className="w-[120px]">Фото</TableHead>
                    <TableHead className="w-[180px]">Мастер</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
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
                        <div className="flex gap-1">
                          {log.photos?.map((photo) => (
                            <a
                              key={photo.id}
                              href={photo.url}
                              target="_blank"
                              rel="noreferrer"
                              className="block w-8 h-8 rounded border overflow-hidden"
                            >
                              <img
                                src={photo.url}
                                className="w-full h-full object-cover"
                                alt="work"
                              />
                            </a>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.master.lastName} {log.master.firstName[0]}.
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
