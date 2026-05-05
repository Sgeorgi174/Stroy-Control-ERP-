import type { ObjectDocType } from "@/types/object-document";

export const DOC_TYPE_LABELS: Record<ObjectDocType, string> = {
  IMPORT: "Ввоз",
  EXPORT: "Вывоз",
  BRING_IN: "Внос",
  TAKE_OUT: "Вынос",
};

export function getDocTypeBadgeClass(type: ObjectDocType): string {
  switch (type) {
    case "IMPORT":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
    case "EXPORT":
      return "bg-rose-500/15 text-rose-400 border-rose-500/20";
    case "BRING_IN":
      return "bg-sky-500/15 text-sky-400 border-sky-500/20";
    case "TAKE_OUT":
      return "bg-amber-500/15 text-amber-400 border-amber-500/20";
    default:
      return "";
  }
}
