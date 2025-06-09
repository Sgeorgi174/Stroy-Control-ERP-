export type TabKey = "tool" | "clothing" | "footwear";

export const TABS: {
  key: TabKey;
  label: string;
  model: "tool" | "clothes";
  filter?: {
    clothesType?: "CLOTHING" | "FOOTWEAR";
  };
}[] = [
  {
    key: "tool",
    label: "Инструменты",
    model: "tool",
  },
  {
    key: "clothing",
    label: "Одежда",
    model: "clothes",
    filter: { clothesType: "CLOTHING" },
  },
  {
    key: "footwear",
    label: "Обувь",
    model: "clothes",
    filter: { clothesType: "FOOTWEAR" },
  },
];
