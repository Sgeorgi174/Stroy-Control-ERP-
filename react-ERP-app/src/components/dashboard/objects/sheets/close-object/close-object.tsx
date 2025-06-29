import { useGetObjectByIdToClose } from "@/hooks/object/useGetByIdToClose";
import { Button } from "@/components/ui/button";
import { ItemCardtoCloseObject } from "./item-card";
import { ErrorBoxToCloseObject } from "./error-box-to-close-object";

type CloseObjectProps = {
  objectId: string;
};

export function CloseObject({ objectId }: CloseObjectProps) {
  const { data, isLoading, isError } = useGetObjectByIdToClose(objectId);

  const incomingUnconfirmedItems = {
    data: data?.incomingUnconfirmedItems,
    isError:
      data?.incomingUnconfirmedItems.tools.length !== 0 ||
      data?.incomingUnconfirmedItems.devices.length !== 0 ||
      data?.incomingUnconfirmedItems.clothes.length !== 0,
  };

  const notEmptyObject = {
    data: data?.notEmptyObject,
    isError:
      data?.notEmptyObject.tools.length !== 0 ||
      data?.notEmptyObject.devices.length !== 0 ||
      data?.notEmptyObject.clothes.length !== 0 ||
      data?.notEmptyObject.employees.length !== 0,
  };
  const outgoingUnconfirmedTransfers = {
    data: data?.outgoingUnconfirmedTransfers,
    isError:
      data?.outgoingUnconfirmedTransfers.tools.length !== 0 ||
      data?.outgoingUnconfirmedTransfers.devices.length !== 0 ||
      data?.outgoingUnconfirmedTransfers.clothes.length !== 0,
  };

  return (
    <div className="mt-6 flex px-7 flex-col">
      <ErrorBoxToCloseObject
        hasIncomingUnconfirmedItemsError={incomingUnconfirmedItems.isError}
        hasNotEmptyObjectError={notEmptyObject.isError}
        hasOutgoingUnconfirmedTransfersError={
          outgoingUnconfirmedTransfers.isError
        }
      />

      <p className="text-xl mt-6 text-center">Не пермещенные элементы</p>

      <div className="flex flex-col gap-2 mt-8">
        <ItemCardtoCloseObject
          handleClick={() => {}}
          category="Инструменты"
          quantity={notEmptyObject.data?.tools.length}
        />
        <ItemCardtoCloseObject
          handleClick={() => {}}
          category="Оргтехника"
          quantity={notEmptyObject.data?.devices.length}
        />
        <ItemCardtoCloseObject
          handleClick={() => {}}
          category="Одежда и обувь"
          quantity={notEmptyObject.data?.clothes.reduce(
            (acc, curr) => acc + curr.quantity,
            0
          )}
        />
        <ItemCardtoCloseObject
          handleClick={() => {}}
          category="Сотрудники"
          quantity={notEmptyObject.data?.employees.length}
        />
      </div>

      <div className="flex w-full justify-end">
        <Button
          disabled={
            incomingUnconfirmedItems.isError ||
            notEmptyObject.isError ||
            outgoingUnconfirmedTransfers.isError
          }
          variant={"destructive"}
          className="mt-8 w-[250px]"
        >
          Закрыть объект
        </Button>
      </div>
    </div>
  );
}
