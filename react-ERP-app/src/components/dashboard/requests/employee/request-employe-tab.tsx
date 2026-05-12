import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePenalties } from "@/hooks/penalties/usePenalties";
import { EmployeeRequestsTable } from "./request-employee-table";
import { Plus } from "lucide-react";
import { PenaltyCreateDialog } from "./create-request-employee-dialog";
import { PenaltyFilters } from "./request-penalty-filters";
import type { GetPenaltyFilterDto } from "@/types/dto/penalty.dto";

export function RequestEmployeeTab() {
  // Состояние фильтров
  const [filters, setFilters] = useState<GetPenaltyFilterDto>({});

  // Передаем фильтры в хук (React Query автоматически перезапросит данные при их изменении)
  const { data = [], isLoading } = usePenalties(filters);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Заявки по штрафам
          </h1>
          <p className="text-sm text-muted-foreground">
            Управление и мониторинг дисциплинарных взысканий
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

      {/* --- СТРОКА ФИЛЬТРОВ --- */}
      <PenaltyFilters filters={filters} setFilters={setFilters} />

      <div className="rounded-xl border bg-card shadow-sm">
        <EmployeeRequestsTable data={data} isLoading={isLoading} />
      </div>

      <PenaltyCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        initialData={null}
      />
    </div>
  );
}
