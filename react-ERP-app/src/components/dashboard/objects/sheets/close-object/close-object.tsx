import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { ToolsStep } from "./tools-step";
import { GeneralInformation } from "./general-information";
import { DeviceStep } from "./device-step";
import { ClotheseStep } from "./clothes-step";
import { EmployeeStep } from "./employee-step";
import { FinalStep } from "./final-step";
import { useGetObjectByIdToClose } from "@/hooks/object/useGetByIdToClose";

type CloseObjectProps = {
  objectId: string;
};

export function CloseObject({ objectId }: CloseObjectProps) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const { data, isLoading, isError } = useGetObjectByIdToClose(objectId);

  console.log(data);

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
          return 6;
        case 6:
          setProgress(100);
          return 6;
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
        {step === 1 && data && (
          <GeneralInformation object={data} handleClick={handleNext} />
        )}
        {step === 2 && <ToolsStep handleClick={handleNext} />}
        {step === 3 && <DeviceStep handleClick={handleNext} />}
        {step === 4 && <ClotheseStep handleClick={handleNext} />}
        {step === 5 && <EmployeeStep handleClick={handleNext} />}
        {step === 6 && <FinalStep handleClick={handleFinal} />}
      </div>
    </div>
  );
}
