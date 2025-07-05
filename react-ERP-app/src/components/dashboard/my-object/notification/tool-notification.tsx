import { useState } from "react";
import { MapPin, Minus, MoveRight, Package, User, Wrench } from "lucide-react";
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
import type { PendingToolTransfer } from "@/types/transfers";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ToolPhotoSection } from "./notification-tool-photo";

type ToolNotificationProp = {
  toolTransfer: PendingToolTransfer;
};

export default function ToolNotification({
  toolTransfer,
}: ToolNotificationProp) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-primary transition-shadow duration-200 border-l-4 gap-2 border-l-violet-500">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center">
                <Package className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-medium  leading-tight">
                  Новое перемещение
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-1">
                  <span>{toolTransfer.tool.name}, в пути на ваш объект</span>

                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2 mt-5">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>
                          {toolTransfer.fromObject.foreman?.lastName}{" "}
                          {toolTransfer.fromObject.foreman?.firstName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{toolTransfer.fromObject.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center mt-5">
                      <Minus />
                      <MoveRight />
                    </div>
                    <div className="flex flex-col gap-2 mt-5">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>
                          {toolTransfer.toObject.foreman?.lastName}{" "}
                          {toolTransfer.toObject.foreman?.firstName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{toolTransfer.toObject.name}</span>
                      </div>
                    </div>
                  </div>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                Требуется подтверждение
              </Badge>
              <span className="text-xs">Нажмите для просмотра</span>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-3xl min-w-[700px] max-h-[80vh] overflow-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-violet-500" />
            Подтверждение перемещения
          </DialogTitle>
          <DialogDescription>
            Пожалуйста, ознакомьтесь с деталями перемещения и подтвердите
            получение инструмента.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-4">
          <div className="space-y-3 font-medium">Инструмент:</div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
            <div className="flex-shrink-0 w-8 h-8  rounded-md flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium  text-sm">{toolTransfer.tool.name}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="font-mono">
                  Серийный номер: {toolTransfer.tool.serialNumber}
                </span>
              </div>
            </div>
          </div>
        </div>
        {isReject && <Separator className="my-2" />}
        {isReject && (
          <div className="flex justify-between">
            <ToolPhotoSection toolTransfer={toolTransfer} />

            <div className="col-8 flex flex-col gap-2">
              <Label>Укажите причину отказа</Label>
              <Textarea
                placeholder="Укажите причину отмены, например (Инструмент пришел неисправным, пришла не та позиция и т.д.)"
                className="resize-none w-[350px] h-full"
              />
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          {!isReject && (
            <div
              className={`flex items-center space-x-2 mb-4 p-3 ${
                isConfirmed ? "bg-green-500/40" : "bg-attention"
              } rounded-lg`}
            >
              <Checkbox
                className="border-accent-foreground"
                id="confirm-responsibility"
                checked={isConfirmed}
                onCheckedChange={(checked) =>
                  setIsConfirmed(checked as boolean)
                }
              />
              <label
                htmlFor="confirm-responsibility"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Я подтверждаю, что получил указанный инвентарь.
              </label>
            </div>
          )}

          <DialogFooter>
            <div className="flex gap-5">
              {isReject && (
                <Button variant="outline" onClick={() => setIsReject(false)}>
                  Отмена
                </Button>
              )}
              <Button variant="destructive" onClick={() => setIsReject(true)}>
                Отказаться
              </Button>
              {!isReject && (
                <Button disabled={!isConfirmed}>{"Принять"}</Button>
              )}
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
