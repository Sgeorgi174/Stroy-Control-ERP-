import { MyObjectObjectCard } from "@/components/dashboard/my-object/my-object-object-card";
import { useAuth } from "@/hooks/auth/useAuth";
import { useObjects } from "@/hooks/object/useObject";
import type { Object } from "@/types/object";
import { Navigate } from "react-router";

export function MyObject() {
  const { data: user } = useAuth();

  const { data: allObjects = [] } = useObjects({
    status: "OPEN",
    searchQuery: "",
  });

  const primaryCount = user?.primaryObjects?.length ?? 0;
  const secondaryCount = user?.secondaryObjects?.length ?? 0;
  const isAllObjectAllowed =
    user?.role === "ADMIN" || user?.role === "ACCOUNTANT";

  const hasAnyObject = primaryCount > 0 || secondaryCount > 0;

  if (isAllObjectAllowed)
    return (
      <>
        <h1 className="text-3xl font-medium mt-6">Выберите объект</h1>
        <div className="grid grid-cols-2 max-[1349px]:grid-cols-2 min-[1350px]:grid-cols-2 gap-5 mt-6">
          {allObjects.map((object: Object) => (
            <MyObjectObjectCard key={object.id} object={object} />
          ))}
        </div>
      </>
    );

  // Если нет объектов — показать сообщение
  if (!hasAnyObject) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="font-bold text-3xl">
          Доступ закрыт. Вы не назначены ни на один объект.
        </p>
      </div>
    );
  }

  // Если только один объект в primary — сразу редирект на динамический маршрут
  if (primaryCount === 1) {
    const objectId = user!.primaryObjects[0].id;
    return <Navigate to={`/my-object/${objectId}`} replace />;
  }

  // Иначе — отображаем список объектов
  return (
    <>
      <h1 className="text-3xl font-medium mt-6">Выберите объект</h1>
      <div className="grid grid-cols-2 max-[1349px]:grid-cols-2 min-[1350px]:grid-cols-2 gap-5 mt-6">
        {user?.primaryObjects.map((object) => (
          <MyObjectObjectCard key={object.id} object={object} />
        ))}
      </div>
    </>
  );
}
