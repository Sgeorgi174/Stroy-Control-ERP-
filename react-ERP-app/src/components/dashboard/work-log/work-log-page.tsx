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

export function WorkLogPage() {
  const [selectedObjectId, setSelectedObjectId] = useState<string>("");
  const [currentDate] = useState(new Date());

  const { data: logs, isLoading } = useWorkLogArchive(selectedObjectId, {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  });

  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Журнал работ</h1>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <ObjectSelectForForms
            objects={objects}
            selectedObjectId={selectedObjectId}
            onSelectChange={(id) => setSelectedObjectId(id || "")}
            className="w-full sm:w-[250px]"
          />
          {selectedObjectId && (
            <CreateWorkLogDialog
              objectId={selectedObjectId}
              existingLogs={logs || []} // Передаем логи для проверки внутри
            />
          )}
        </div>
      </div>

      {!selectedObjectId ? (
        <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
          Выберите объект, чтобы просмотреть или создать записи в журнале
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          {/* Десктопная таблица */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Дата</TableHead>
                  <TableHead>Описание работ</TableHead>
                  <TableHead className="w-[200px]">Мастер</TableHead>
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
                    <TableCell className="text-muted-foreground text-sm">
                      {log.master.lastName} {log.master.firstName}
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
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">
                    {format(new Date(log.date), "dd MMMM", { locale: ru })}
                  </span>
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    {log.master.lastName}
                  </span>
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
            <div className="p-8 text-center text-muted-foreground">
              Записей за этот месяц пока нет.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
