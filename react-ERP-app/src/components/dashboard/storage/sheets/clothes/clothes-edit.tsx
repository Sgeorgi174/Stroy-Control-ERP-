import type { Clothes } from "@/types/clothes";

export function ClothesEdit({ clothes }: { clothes: Clothes }) {
  return (
    <div className="mt-4">
      Edit: <strong>{clothes.name}</strong> (ID: {clothes.id})
    </div>
  );
}
