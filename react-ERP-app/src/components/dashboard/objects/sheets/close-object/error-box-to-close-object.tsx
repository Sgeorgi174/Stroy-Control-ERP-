import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DotIcon, TriangleAlertIcon } from "lucide-react";

type ErrorBoxToCloseObjectProps = {
  hasIncomingUnconfirmedItemsError: boolean;
  hasNotEmptyObjectError: boolean;
  hasOutgoingUnconfirmedTransfersError: boolean;
};

export function ErrorBoxToCloseObject({
  hasIncomingUnconfirmedItemsError,
  hasNotEmptyObjectError,
  hasOutgoingUnconfirmedTransfersError,
}: ErrorBoxToCloseObjectProps) {
  return (
    <Accordion type="single" collapsible>
      {hasIncomingUnconfirmedItemsError && (
        <AccordionItem value="item-1">
          <AccordionTrigger className="border p-3 bg-attention">
            <div className="flex items-center gap-5">
              <TriangleAlertIcon
                className="w-[20px]"
                strokeWidth={3}
                color="#9A2525"
              />
              <p className="font-medium">Невозможно закрыть объект!</p>
              <p className="font-medium">Причина: Не принятый инвентарь</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border rounded-sm mt-2 p-3 bg-attention">
            <div className="flex flex-col gap-2">
              <p>Перед закрытием необходимо убедиться, что:</p>
              <div className="flex items-center gap-3">
                <DotIcon />
                <p>
                  На объекте отсутствует непринятый инвентарь (инструменты,
                  оргтехника, одежда или обувь)
                </p>
              </div>
              <p>
                Пожалуйста, подтвердите все перемещения на этот объект перед
                закрытием.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {hasNotEmptyObjectError && (
        <AccordionItem className="mt-2" value="item-2">
          <AccordionTrigger className="border p-3 bg-attention">
            <div className="flex items-center gap-5">
              <TriangleAlertIcon
                className="w-[20px]"
                strokeWidth={3}
                color="#9A2525"
              />
              <p className="font-medium">Невозможно закрыть объект!</p>
              <p className="font-medium">Причина: Не распределенные остатки</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border rounded-sm mt-2 p-3 bg-attention">
            <div className="flex flex-col gap-2">
              <p>Перед закрытием необходимо убедиться, что:</p>
              <div className="flex items-center gap-3">
                <DotIcon />
                <p>Все инструменты перемещены с объекта</p>
              </div>
              <div className="flex items-center gap-3">
                <DotIcon />
                <p>Вся оргтехника перенесена с объекта</p>
              </div>
              <div className="flex items-center gap-3">
                <DotIcon />
                <p>Вся одежда и обувь перенесена с объекта</p>
              </div>
              <div className="flex items-center gap-3">
                <DotIcon />
                <p>
                  Все сотрудники переведены на другие объекты или освобождены.
                </p>
              </div>
              <p>
                Пожалуйста, завершите распределение всех ресурсов перед
                закрытием объекта.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {hasOutgoingUnconfirmedTransfersError && (
        <AccordionItem className="mt-2" value="item-3">
          <AccordionTrigger className="border p-3 bg-attention">
            <div className="flex items-center gap-5">
              <TriangleAlertIcon
                className="w-[20px]"
                strokeWidth={3}
                color="#9A2525"
              />
              <p className="font-medium">Невозможно закрыть объект!</p>
              <p className="font-medium">
                Причина: Есть неподтвержденные перемещения с этого объекта
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border rounded-sm mt-2 p-3 bg-attention">
            <div className="flex flex-col gap-2">
              <p>Перед закрытием необходимо убедиться, что:</p>
              <div className="flex items-center gap-3">
                <DotIcon />
                <p>
                  Все перемещения, совершённые с этого объекта, подтверждены
                </p>
              </div>
              <p>Пожалуйста, дождитесь подтверждения всех перемещений.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
