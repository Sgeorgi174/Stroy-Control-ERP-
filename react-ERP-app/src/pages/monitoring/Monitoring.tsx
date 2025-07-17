import { ObjectCard } from "@/components/monitoring/object-card";
import { useObjects } from "@/hooks/object/useObject";
import type { Object } from "@/types/object";

export function Monitoring() {
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });
  return (
    <div className="grid grid-cols-2 max-[1349px]:grid-cols-2 min-[1350px]:grid-cols-3 gap-5 mt-6">
      {objects.map((object: Object) => (
        <ObjectCard key={object.id} object={object} />
      ))}
    </div>
  );
}
