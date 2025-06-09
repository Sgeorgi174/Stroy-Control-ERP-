import type { Clothes } from "@/types/clothes";

export function ClothesTransfer({ clothes }: { clothes: Clothes }) {
  return (
    <div className="mt-4">
      Transfer: <strong>{clothes.name}</strong> (ID: {clothes.id})
    </div>
  );
}
