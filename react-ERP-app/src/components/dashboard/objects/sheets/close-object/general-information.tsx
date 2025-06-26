import { Button } from "@/components/ui/button";
import { ItemCardtoCloseObject } from "./item-card";
import type { Object } from "@/types/object";
import { ErrorBoxToCloseObject } from "./error-box-to-close-object";

type GeneralInformationProps = {
  handleClick: () => void;
  object: Object;
};

export function GeneralInformation({
  object,
  handleClick,
}: GeneralInformationProps) {
  return (
    <div className="mt-6 flex px-7 flex-col">
      <ErrorBoxToCloseObject object={object} />

      <p className="text-xl mt-6 text-center">Остатки</p>

      <div className="flex flex-col gap-2 mt-8">
        <ItemCardtoCloseObject
          category="Инструменты"
          quantity={object.tools.length}
        />
        <ItemCardtoCloseObject
          category="Оргтехника"
          quantity={object.devices.length}
        />
        <ItemCardtoCloseObject
          category="Одежда и обувь"
          quantity={object.clothes.length}
        />
        <ItemCardtoCloseObject
          category="Сотрудники"
          quantity={object.employees.length}
        />
      </div>

      <div className="flex w-full justify-end">
        <Button
          variant={"destructive"}
          className="mt-8 w-[250px]"
          onClick={handleClick}
        >
          Начать закрытие объекта
        </Button>
      </div>
    </div>
  );
}
