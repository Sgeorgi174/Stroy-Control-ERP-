import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateEmployee } from "@/hooks/employee/useCreateEmployee";
import type { CreateEmployeeDto } from "@/types/dto/employee.dto";

// === Генераторы случайных данных ===

const firstNames = [
  "Иван",
  "Павел",
  "Дмитрий",
  "Алексей",
  "Сергей",
  "Константин",
  "Максим",
];
const lastNames = [
  "Смирнов",
  "Кузнецов",
  "Морозов",
  "Иванов",
  "Поляков",
  "Егоров",
  "Федоров",
];
const fatherNames = [
  "Игоревич",
  "Павлович",
  "Алексеевич",
  "Сергеевич",
  "Владимирович",
  "Оглы",
];

const random = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const randomPhone = () =>
  `+79${Math.floor(100000000 + Math.random() * 900000000)}`;

const randomDob = () => {
  const year = 1970 + Math.floor(Math.random() * 30);
  const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
  const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const randomPassport = () => ({
  serial: "AZE",
  number: String(Math.floor(100000 + Math.random() * 900000)),
});

const randomAddress = () => ({
  region: "Свердловская область",
  city: "Екатеринбург",
  street: "Ленина",
  build: String(1 + Math.floor(Math.random() * 100)),
});

// ——— Компонент ———

export function GenerateEmployees({ objectId }: { objectId: string }) {
  const { mutateAsync: createEmployee } = useCreateEmployee();

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateOne = (): CreateEmployeeDto => {
    const f = random(firstNames);
    const l = random(lastNames);
    const fn = random(fatherNames);

    const pass = randomPassport();
    const addr = randomAddress();

    return {
      type: "ACTIVE",
      firstName: f,
      lastName: l,
      fatherName: fn,
      dob: randomDob(),
      phoneNumber: randomPhone(),

      country: "KG",
      passportSerial: pass.serial,
      passportNumber: pass.number,
      whereIssued: "ГУ МВД России по Челябинской области",
      issueDate: "2024-11-01",
      startWorkDate: "2024-11-01",

      registrationRegion: addr.region,
      registrationCity: addr.city,
      registrationStreet: addr.street,
      registrationBuild: addr.build,
      registrationFlat: "",

      position: "Разнорабочий",
      status: "OK",
      objectId,

      clothingSizeId: "cfc22143-ff32-4394-b3a9-d6397d649e86",
      clothingHeightId: "2a063d62-9052-489b-aa55-93e5dab7cb9a",
      footwearSizeId: "7830729c-a5eb-401b-9c02-668e2df89bfe",
    };
  };

  const generate25 = async () => {
    setIsGenerating(true);
    setProgress(0);

    for (let i = 1; i <= 25; i++) {
      const dto = generateOne();
      await createEmployee(dto); // создаём по очереди
      setProgress(i);
    }

    setIsGenerating(false);
  };

  return (
    <div className="space-y-4">
      <Button onClick={generate25} disabled>
        {isGenerating ? "Создание..." : "Создать 25 сотрудников"}
      </Button>

      {isGenerating && (
        <p className="text-sm text-muted-foreground">
          Создано: {progress} / 25
        </p>
      )}
    </div>
  );
}
