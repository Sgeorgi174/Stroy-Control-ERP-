import { RequestClothesTab } from "@/components/dashboard/requests/clothes/request-clothes-tab";
import { RequestEmployeeTab } from "@/components/dashboard/requests/employee/request-employe-tab";
import { RequestOvertimeTab } from "@/components/dashboard/requests/overtime/request-overtime-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shirt, Users, Wrench } from "lucide-react";
import { useState } from "react";

export function Requests() {
  const [activeTab, setActiveTab] = useState("clothes");
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full mt-6"
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="clothes">
          <Shirt className="h-4 w-4 mr-2" /> Одежда
        </TabsTrigger>
        <TabsTrigger disabled value="tools">
          <Wrench className="h-4 w-4 mr-2" /> Инструмент
        </TabsTrigger>
        <TabsTrigger value="penalties">
          <Users className="h-4 w-4 mr-2" /> Штрафы
        </TabsTrigger>
        <TabsTrigger value="overtime">
          <Users className="h-4 w-4 mr-2" /> Доп. Часы
        </TabsTrigger>
      </TabsList>

      <TabsContent value="clothes" className="space-y-4 mt-6">
        <RequestClothesTab />
      </TabsContent>

      <TabsContent value="penalties" className="space-y-4 mt-6">
        <RequestEmployeeTab />
      </TabsContent>

      <TabsContent value="overtime" className="space-y-4 mt-6">
        <RequestOvertimeTab />
      </TabsContent>
    </Tabs>
  );
}
