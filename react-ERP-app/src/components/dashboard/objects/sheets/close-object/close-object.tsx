import { Progress } from "@/components/ui/progress";
import type { Object } from "@/types/object";
import { useState } from "react";
import { ToolsStep } from "./tools-step";
import { GeneralInformation } from "./general-information";
import { DeviceStep } from "./device-step";
import { ClotheseStep } from "./clothes-step";
import { EmployeeStep } from "./employee-step";
import { FinalStep } from "./final-step";

type CloseObjectProps = {
  object: Object;
};

export function CloseObject({ object }: CloseObjectProps) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  const handleNext = async () => {
    setStep((prev) => {
      switch (prev) {
        case 1:
          return 2;
        case 2:
          setProgress(25);
          return 3;
        case 3:
          setProgress(50);
          return 4;
        case 4:
          setProgress(75);
          return 5;
        case 5:
          setProgress(100);
          return 6; // уже последний шаг
        case 6:
          setProgress(100);
          return 6; // уже последний шаг
      }
    });
  };

  const handleFinal = async () => {
    console.log("click");
  };

  return (
    <div>
      <div className="flex justify-center">
        {step !== 1 && <Progress value={progress} className="w-[60%]" />}
      </div>
      <div>
        {" "}
        {step === 1 && <GeneralInformation handleClick={handleNext} />}
        {step === 2 && <ToolsStep handleClick={handleNext} />}
        {step === 3 && <DeviceStep handleClick={handleNext} />}
        {step === 4 && <ClotheseStep handleClick={handleNext} />}
        {step === 5 && <EmployeeStep handleClick={handleNext} />}
        {step === 6 && <FinalStep handleClick={handleFinal} />}
      </div>
    </div>
  );
}
