import { Button } from "@/components/ui/button";
import { CircleCheckBigIcon, DotIcon, TriangleAlertIcon } from "lucide-react";

type GeneralInformationProps = {
  handleClick: () => void;
};

export function GeneralInformation({ handleClick }: GeneralInformationProps) {
  return (
    <div className="mt-6 flex p-7 flex-col">
      <div>
        <div className="flex items-center gap-2">
          <TriangleAlertIcon
            className="w-[20px]"
            strokeWidth={3}
            color="#9A2525"
          />
          <p className="font-medium">Невозможно закрыть объект</p>
        </div>
        <div className="flex flex-col">
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
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="mt-5 text-[20px]">Инструменты - x</p>
        <p className="text-[20px]">Орг. Техника - x</p>
        <div className="flex items-center gap-8">
          <p className="text-[20px]">Одежда обувь - 0</p>
          {/* <div className="rounded-full flex justify-center items-center bg-accent w-[25px] h-[25px]"></div> */}
          <CircleCheckBigIcon
            className="w-[20px]"
            strokeWidth={3}
            color="#23732E"
          />
        </div>
        <div className="flex items-center gap-8">
          <p className="text-[20px]">Сотрудники - 0</p>
          {/* <div className="rounded-full flex justify-center items-center bg-accent w-[25px] h-[25px]"></div> */}
          <CircleCheckBigIcon
            className="w-[20px]"
            strokeWidth={3}
            color="#23732E"
          />
        </div>
      </div>
      <Button variant={"destructive"} className="mt-8" onClick={handleClick}>
        Начать закрытие объекта
      </Button>
    </div>
  );
}
