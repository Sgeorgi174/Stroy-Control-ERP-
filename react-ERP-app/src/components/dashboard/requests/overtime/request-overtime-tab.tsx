import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { GetPenaltyFilterDto } from "@/types/dto/penalty.dto";
import { useOvertimes } from "@/hooks/overtime/useOvertimes";
import { OvertimeFilters } from "./request-overtime-filters";
import { OvertimeRequestsTable } from "./request-overtime-table";
import { OvertimeCreateDialog } from "./create-request-overtime-dialog";

export function RequestOvertimeTab() {
  // Состояние фильтров
  const [filters, setFilters] = useState<GetPenaltyFilterDto>({});

  // Передаем фильтры в хук (React Query автоматически перезапросит данные при их изменении)
  const { data = [], isLoading } = useOvertimes(filters);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Заявки по доп. часам
          </h1>
          <p className="text-sm text-muted-foreground">
            Управление и мониторинг дополнительных часов
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Создать заявку
        </Button>
      </div>
      <OvertimeFilters filters={filters} setFilters={setFilters} />
      <div className="rounded-xl border bg-card shadow-sm">
        <OvertimeRequestsTable data={data} isLoading={isLoading} />
      </div>
      <OvertimeCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        initialData={null}
      />
    </div>
  );
}
