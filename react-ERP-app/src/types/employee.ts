import type { EmployeeClothingItem } from "./employeesClothing";
import type { Object } from "./object";
import type { User } from "./user";

export type EmployeeStatuses = "OK" | "WARNING" | "OVERDUE" | "INACTIVE";
export type Positions =
  | "Мастер СМР"
  | "Электромонтажник"
  | "Разнорабочий"
  | "Кладовщик"
  | "Сварщик"
  | "Расключник"
  | "Помошник руководителя"
  | "Инженер"
  | "Начальник участка"
  | "Бригадир"
  | "Не назначен";

export type EmployeeType = "ACTIVE" | "ARCHIVE";

export type Countries = "RU" | "KZ" | "TJ" | "KG" | "BY" | "AZ";

export type Skill = {
  id: string;
  skill: string;
};

export type ArchiveRecord = {
  id: string;
  comment: string;
  archivedAt: string;
  changedBy: User;
};

export type EmployeeWarning = {
  id: string;
  warningType:
    | "CLOTHING_SUMMER"
    | "CLOTHING_WINTER"
    | "FOOTWEAR_SUMMER"
    | "FOOTWEAR_WINTER"
    | "PASSPORT";
  message: string;
  employeeId: string;
};

export type Employee = {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  phoneNumber: string;
  clothingSize: { id: string; size: string };
  footwearSize: { id: string; size: string };
  clothingHeight: { id: string; height: string };
  position: Positions;
  objectId: string;
  dob: string;
  startWorkDate: string;
  clothing: EmployeeClothingItem[];
  workPlace: Object | null;
  status: EmployeeStatuses;
  skills: Skill[];
  type: EmployeeType;
  archive: ArchiveRecord | null;
  country: Countries;
  passportSerial: string;
  passportNumber: string;
  whereIssued: string;
  issueDate: string;
  registrationRegion: string;
  registrationCity: string;
  registrationStreet: string;
  registrationBuild: string;
  registrationFlat: string | undefined;
  warnings: EmployeeWarning[];
};
