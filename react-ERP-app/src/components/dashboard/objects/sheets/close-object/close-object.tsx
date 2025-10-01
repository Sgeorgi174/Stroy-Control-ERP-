import { useGetObjectByIdToClose } from "@/hooks/object/useGetByIdToClose";
import { Button } from "@/components/ui/button";
import { ItemCardtoCloseObject } from "./item-card";
import { ErrorBoxToCloseObject } from "./error-box-to-close-object";
import { useNavigate } from "react-router";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import type { TabKey } from "@/types/tabs";
import { useObjectSheetStore } from "@/stores/objects-sheet-store";
import { useCloseObject } from "@/hooks/object/useCloseObject";
import { useState } from "react";
import { CloseObjectDialog } from "./close-object-dialog";

type CloseObjectProps = {
  objectId: string;
};

export function CloseObject({ objectId }: CloseObjectProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data } = useGetObjectByIdToClose(objectId);
  const closeMutation = useCloseObject();
  const setActiveTab = useFilterPanelStore((s) => s.setActiveTab);
  const setSelectedObjectId = useFilterPanelStore((s) => s.setSelectedObjectId);
  const { closeSheet } = useObjectSheetStore();
  const navigate = useNavigate();

  const navigateToRoute = (tab: TabKey, route: string) => {
    setActiveTab(tab);
    setSelectedObjectId(objectId);
    navigate(route);
    closeSheet();
  };

  const handleConfirmClose = () => {
    closeMutation.mutate(objectId, {
      onSuccess: () => {
        setIsDialogOpen(false);
        closeSheet();
      },
    });
  };
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
          handleClick={() => {
            navigateToRoute("tool", "/storage");
          }}
          category="Инструменты"
          quantity={notEmptyObject.data?.tools.length}
        />
        <ItemCardtoCloseObject
          handleClick={() => {
            navigateToRoute("device", "/storage");
          }}
          category="Оргтехника"
          quantity={notEmptyObject.data?.devices.length}
        />
        <ItemCardtoCloseObject
          handleClick={() => {
            navigateToRoute("clothing", "/storage");
          }}
          category="Одежда и обувь"
          quantity={notEmptyObject.data?.clothes.reduce(
            (acc, curr) => acc + curr.quantity,
            0
          )}
        />
        <ItemCardtoCloseObject
          handleClick={() => {
            navigateToRoute("employee", "/employees");
          }}
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
          onClick={() => setIsDialogOpen(true)}
        >
          Закрыть объект
        </Button>

        <CloseObjectDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onConfirm={handleConfirmClose}
        />
      </div>
    </div>
  );
}
