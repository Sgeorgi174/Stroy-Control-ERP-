import type { Tablet } from "@/types/tablet";

export const tablets: Tablet[] = [
  {
    id: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "iPad Pro 11",
    serialNumber: "SN001",
    status: "ACTIVE",
    employee: {
      id: "emp1",
      firstName: "Иван",
      lastName: "Иванов",
      phoneNumber: "+79110000001",
    },
  },
  {
    id: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Samsung Galaxy Tab S8",
    serialNumber: "SN002",
    status: "INACTIVE",
    employee: null,
  },
  {
    id: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Lenovo Tab M10",
    serialNumber: "SN003",
    status: "IN_REPAIR",
    employee: {
      id: "emp3",
      firstName: "Анна",
      lastName: "Сидорова",
      phoneNumber: "+79110000003",
    },
  },
  {
    id: "4",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Huawei MatePad",
    serialNumber: "SN004",
    status: "ACTIVE",
    employee: {
      id: "emp4",
      firstName: "Максим",
      lastName: "Орлов",
      phoneNumber: "+79110000004",
    },
  },
  {
    id: "5",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Microsoft Surface Go",
    serialNumber: "SN005",
    status: "LOST",
    employee: null,
  },
  {
    id: "6",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "iPad Mini",
    serialNumber: "SN006",
    status: "WRITTEN_OFF",
    employee: null,
  },
  {
    id: "7",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Asus ZenPad",
    serialNumber: "SN007",
    status: "ACTIVE",
    employee: {
      id: "emp6",
      firstName: "Николай",
      lastName: "Смирнов",
      phoneNumber: "+79110000006",
    },
  },
  {
    id: "8",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Xiaomi Pad 5",
    serialNumber: "SN008",
    status: "IN_REPAIR",
    employee: {
      id: "emp7",
      firstName: "Юлия",
      lastName: "Кузнецова",
      phoneNumber: "+79110000007",
    },
  },
  {
    id: "9",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Amazon Fire HD 10",
    serialNumber: "SN009",
    status: "ACTIVE",
    employee: {
      id: "emp8",
      firstName: "Светлана",
      lastName: "Волкова",
      phoneNumber: "+79110000008",
    },
  },
  {
    id: "10",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Teclast T40",
    serialNumber: "SN010",
    status: "INACTIVE",
    employee: null,
  },
];
