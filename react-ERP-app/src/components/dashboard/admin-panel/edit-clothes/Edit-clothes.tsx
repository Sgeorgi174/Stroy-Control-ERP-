import type { EmployeeClothingItem } from "@/types/employeesClothing";
import { EditIssuedClothingDialog } from "./Edit-clothes-dialog";
import { useUpdateIssuedClothing } from "@/hooks/employee/useUpdateIssuedClothing";

type EmployeeClothingSectionProps = {
  employeeClothes: EmployeeClothingItem[];
};

export function EmployeeClothingSection({
  employeeClothes,
}: EmployeeClothingSectionProps) {
  const { mutate: updateIssuedClothing } = useUpdateIssuedClothing();

  console.log(employeeClothes);

  return (
    <div className="space-y-3 mt-4">
      {employeeClothes.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border p-3 rounded-lg"
        >
          <div>
            <div className="flex gap-4">
              {" "}
              <p className="font-medium">{item.clothing.name} </p>
              <p className="font-medium">
                {item.clothing.type === "CLOTHING"
                  ? item.clothing.clothingSize.size
                  : item.clothing.footwearSize.size}
              </p>
              <p className="font-medium">
                {item.clothing.type === "CLOTHING"
                  ? item.clothing.clothingHeight.height
                  : ""}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Выдано: {new Date(item.issuedAt).toLocaleDateString()} | Цена:{" "}
              {item.priceWhenIssued}₽ | Остаток долга: {item.debtAmount}₽
            </p>
          </div>
          <EditIssuedClothingDialog
            clothingItem={item}
            onSave={(updated) =>
              updateIssuedClothing({ recordId: item.id, data: updated })
            }
          />
        </div>
      ))}
    </div>
  );
}
