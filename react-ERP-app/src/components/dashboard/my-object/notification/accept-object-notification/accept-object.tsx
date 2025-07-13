import { useState } from "react";
import { AlertTriangle, Wrench, Printer, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { Tool } from "@/types/tool";
import type { Device } from "@/types/device";
import type { Clothes } from "@/types/clothes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BootIcon } from "@/components/ui/boot";
import { useActivateObject } from "@/hooks/user/useActivateObject";

type NotificationPanelProp = {
  tools: Tool[];
  devices: Device[];
  clothes: Clothes[];
  objectId: string;
};

export function ObjectNotification({
  tools,
  devices,
  clothes,
  objectId,
}: NotificationPanelProp) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: activateObject, isPending } = useActivateObject();

  const handleConfirm = () => {
    activateObject(objectId, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setIsConfirmed(false);
      },
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-primary transition-shadow duration-200 border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-medium  leading-tight">
                  Требуется подтверждение нового бригадира
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-1">
                  Вы должны принять объект и весь прикреплённый инвентарь.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                Требуется действие
              </Badge>
              <span className="text-xs">Нажмите для просмотра</span>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-3xl min-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Принятие инвентаря на объекте
          </DialogTitle>
          <DialogDescription>
            В качестве нового бригадира, пожалуйста, ознакомьтесь со списком
            инвентаря ниже и подтвердите, что вы принимаете все позиции,
            прикреплённые к объекту.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-3">
            <Accordion
              className="flex flex-col gap-3"
              type="single"
              collapsible
            >
              <AccordionItem value="tools">
                <AccordionTrigger className="border w-full text-start p-2 px-4 rounded-xl font-medium">
                  Инструменты ( позиций: {tools.length} )
                </AccordionTrigger>
                <AccordionContent>
                  {tools.map((item, index) => (
                    <div key={item.id} className="mt-2">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                        <div className="flex-shrink-0 w-8 h-8  rounded-md flex items-center justify-center">
                          <Wrench className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium  text-sm">{item.name}</p>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="font-mono">
                              Серийный номер: {item.serialNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                      {index < tools.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="devices">
                <AccordionTrigger className="border w-full text-start p-2 px-4 rounded-xl font-medium">
                  Оргтехника ( позиций: {devices.length} )
                </AccordionTrigger>
                <AccordionContent>
                  {devices.map((item, index) => (
                    <div key={item.id} className="mt-2">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                        <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center">
                          <Printer className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium  text-sm">{item.name}</p>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="font-mono">
                              Серийный номер: {item.serialNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                      {index < devices.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="clothes">
                <AccordionTrigger className="border w-full text-start p-2 px-4 rounded-xl font-medium">
                  Рабочая одежда/обувь ( кол-во:{" "}
                  {clothes.reduce((acc, curr) => acc + curr.quantity, 0)} )
                </AccordionTrigger>
                <AccordionContent>
                  {clothes.map((item, index) => (
                    <div key={item.id} className="mt-2">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                        <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center">
                          {item.type === "CLOTHING" ? (
                            <Shirt className="w-4 h-4" />
                          ) : (
                            <BootIcon className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium  text-sm">{item.name}</p>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="font-mono">
                              Сезон: {item.season}
                            </span>
                            <span className="font-mono">
                              Размер: {item.size}
                            </span>
                            <span className="font-mono">
                              Кол-во: {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                      {index < clothes.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="border-t pt-4">
          <div
            className={`flex items-center space-x-2 mb-4 p-3 ${
              isConfirmed ? "bg-green-500/40" : "bg-attention"
            } rounded-lg`}
          >
            <Checkbox
              className="border-accent-foreground"
              id="confirm-responsibility"
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
            />
            <label
              htmlFor="confirm-responsibility"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Я подтверждаю, что получил весь инвентарь и принимаю полную
              ответственность за указанные позиции в качестве бригадира объекта.
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отменить
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isConfirmed || isPending}
            >
              {isPending ? "Принятие..." : "Принять объект"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
