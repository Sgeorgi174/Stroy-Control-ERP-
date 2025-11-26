import { useParams } from "react-router";
import { useObjectById } from "@/hooks/object/useObjectById";
import { MyObjectMasterPanel } from "./my-object-master-panel";
import { useObjectHeaderStore } from "@/stores/object-header-store";
import { useEffect } from "react";

export default function MyObjectPanelWrapper() {
  const { id } = useParams<{ id: string }>();

  const { data: object, isLoading, isError } = useObjectById(id!);

  const setObjectName = useObjectHeaderStore((s) => s.setObjectName);

  useEffect(() => {
    if (object) {
      setObjectName(object.name);
    }
    return () => setObjectName(null);
  }, [object, setObjectName]);

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-xl font-semibold">Загрузка...</p>
      </div>
    );
  }

  if (isError || !object) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-xl font-semibold">Объект не найден</p>
      </div>
    );
  }

  return <MyObjectMasterPanel object={object} />;
}
