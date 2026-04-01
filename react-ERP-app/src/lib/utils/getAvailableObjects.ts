import type { Object } from "@/types/object";
import type { User } from "@/types/user";

export function getAvailableObjects(
  user?: User,
  allObjects: Object[] = [],
): Object[] {
  if (!user) return [];

  if (user.role === "ADMIN") {
    return allObjects;
  }

  const combined = [
    ...(user.primaryObjects ?? []),
    ...(user.secondaryObjects ?? []),
  ];

  const unique = Array.from(
    new Map(combined.map((obj) => [obj.id, obj])).values(),
  );

  // сортировка по имени
  return unique.sort((a, b) => a.name.localeCompare(b.name));
}
