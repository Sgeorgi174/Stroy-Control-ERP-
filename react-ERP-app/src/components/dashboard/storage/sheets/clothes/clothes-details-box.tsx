import type { Clothes } from "@/types/clothes";

type ClothesDetailsBoxProps = { clothes: Clothes };

export function ClothesDetailsBox({ clothes }: ClothesDetailsBoxProps) {
  return (
    <>
      <p>
        Наименование: <span className="font-medium">{clothes.name}</span>
      </p>
      <p>
        Размер: <span className="font-medium">{clothes.size}</span>
      </p>
      <p>
        Сезон:{" "}
        <span className="font-medium">
          {clothes.season === "SUMMER" ? "Лето" : "Зима"}
        </span>
      </p>
      <p>
        Количество: <span className="font-medium">{clothes.quantity}</span>
      </p>
      <p>
        В пути:{" "}
        <span className="font-medium">
          {clothes.inTransit.reduce((acc, curr) => acc + curr.quantity, 0)}
        </span>
      </p>
      <p>
        Место хранения:{" "}
        <span className="font-medium">{clothes.storage.name}</span>
      </p>
    </>
  );
}
