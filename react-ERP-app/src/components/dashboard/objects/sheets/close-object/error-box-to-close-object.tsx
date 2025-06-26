import type { Object } from "@/types/object";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DotIcon, TriangleAlertIcon } from "lucide-react";

type ErrorBoxToCloseObjectProps = {
  object: Object;
};

export function ErrorBoxToCloseObject({ object }: ErrorBoxToCloseObjectProps) {
  return (
    <Accordion type="single" collapsible>
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
          <p>Перед закрытием необходимо убедиться, что:</p>
          <div className="flex items-center gap-3">
            <DotIcon />
            <p>
              У вас отсутвует не принятый инвентарь (интрументы, оргтехника.
              одежда или обувь)
            </p>
          </div>
          <p>
            Пожалуйста, подтвердите все перемещения на этот объект перед
            закрытием
          </p>
        </AccordionContent>
      </AccordionItem>

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
            <p>Все сотрудники переведены на другие объекты или освобождены.</p>
          </div>
          <p>
            Пожалуйста, завершите распределение всех элементов перед закрытием.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    // <Card className="p-5 bg-attention">
    //   <div className="flex items-center gap-2">
    //     <TriangleAlertIcon
    //       className="w-[20px]"
    //       strokeWidth={3}
    //       color="#9A2525"
    //     />
    //     <p className="font-medium">Невозможно закрыть объект</p>
    //   </div>
    //   <div className="flex flex-col">
    //     <p>Перед закрытием необходимо убедиться, что:</p>
    //     <div className="flex items-center gap-3">
    //       <DotIcon />
    //       <p>Все инструменты перемещены с объекта</p>
    //     </div>
    //     <div className="flex items-center gap-3">
    //       <DotIcon />
    //       <p>Вся оргтехника перенесена с объекта</p>
    //     </div>
    //     <div className="flex items-center gap-3">
    //       <DotIcon />
    //       <p>Вся одежда и обувь перенесена с объекта</p>
    //     </div>
    //     <div className="flex items-center gap-3">
    //       <DotIcon />
    //       <p>Все сотрудники переведены на другие объекты или освобождены.</p>
    //     </div>
    //     <p>
    //       Пожалуйста, завершите распределение всех элементов перед закрытием.
    //     </p>
    //   </div>
    // </Card>
  );
}
