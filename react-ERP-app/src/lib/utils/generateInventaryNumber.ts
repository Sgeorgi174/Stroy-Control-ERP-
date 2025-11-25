export function generateInventoryNumber(
  prefix: string,
  usedNumbers: string[]
): string {
  const existing = new Set(
    usedNumbers
      .filter((num) => num.startsWith(prefix + "-"))
      .map((num) => Number(num.split("-")[1]))
  );

  for (let i = 1; i <= 9999; i++) {
    if (!existing.has(i)) {
      return `${prefix}-${i.toString().padStart(4, "0")}`;
    }
  }

  throw new Error("Свободные номера закончились");
}
