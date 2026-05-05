import { FilterPanel } from "@/components/dashboard/filter-panel/filter-panel";
import { WorkLogPageDeliveries } from "@/components/dashboard/work-log/work-log-deliveries";
import { WorkLogPage } from "@/components/dashboard/work-log/work-log-page";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function WorkLog() {
  return (
    <>
      <FilterPanel>
        <Tabs defaultValue="work-log" className="w-full">
          <TabsList>
            <TabsTrigger value="work-log">Журнал выполненных работ</TabsTrigger>
            <TabsTrigger value="deliveries">
              Журнал по приходу материала
            </TabsTrigger>
          </TabsList>

          <TabsContent value="work-log">
            <WorkLogPage />
          </TabsContent>

          <TabsContent value="deliveries">
            <WorkLogPageDeliveries />
          </TabsContent>
        </Tabs>
      </FilterPanel>
    </>
  );
}
