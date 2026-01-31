import type { Clothes } from "@/types/clothes";

function parseRangeStart(value?: string): number {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
}

export function sortClothes(items: Clothes[]): Clothes[] {
  return [...items].sort((a, b) => {
    // 1️⃣ Наименование
    const nameCompare = a.name.localeCompare(b.name, "ru", {
      sensitivity: "base",
    });
    if (nameCompare !== 0) return nameCompare;

    // 2️⃣ Размер
    const sizeA =
      a.type === "CLOTHING" ? a.clothingSize?.size : a.footwearSize?.size;

    const sizeB =
      b.type === "CLOTHING" ? b.clothingSize?.size : b.footwearSize?.size;

    const sizeCompare = parseRangeStart(sizeA) - parseRangeStart(sizeB);
    if (sizeCompare !== 0) return sizeCompare;

    // 3️⃣ Ростовка (только одежда)
    const heightCompare =
      parseRangeStart(a.clothingHeight?.height) -
      parseRangeStart(b.clothingHeight?.height);

    return heightCompare;
  });
}
