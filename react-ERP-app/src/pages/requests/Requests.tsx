import { RequestClothesTab } from "@/components/dashboard/requests/clothes/request-clothes-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutList, Shirt, Users, Wrench } from "lucide-react";
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
        <TabsTrigger disabled value="employment">
          <Users className="h-4 w-4 mr-2" /> Трудоустройство
        </TabsTrigger>
        <TabsTrigger disabled value="other">
          <LayoutList className="h-4 w-4 mr-2" /> Разное
        </TabsTrigger>
      </TabsList>

      <TabsContent value="clothes" className="space-y-4 mt-6">
        <RequestClothesTab />
      </TabsContent>
    </Tabs>
  );
}
