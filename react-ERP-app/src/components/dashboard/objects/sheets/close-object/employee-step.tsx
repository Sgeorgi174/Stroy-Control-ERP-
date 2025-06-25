import { Button } from "@/components/ui/button";

type EmployeeStepProps = {
  handleClick: () => void;
};

export function EmployeeStep({ handleClick }: EmployeeStepProps) {
  return (
    <div className="mt-6 flex p-7 flex-col">
      <p>Employee</p>
      <Button className="mt-6" onClick={handleClick}>
        Next
      </Button>
    </div>
  );
}
