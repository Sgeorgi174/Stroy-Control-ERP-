import { Button } from "@/components/ui/button";

type DeviceStepProps = {
  handleClick: () => void;
};

export function DeviceStep({ handleClick }: DeviceStepProps) {
  return (
    <div className="mt-6 flex p-7 flex-col">
      <p>Device</p>
      <Button className="mt-6" onClick={handleClick}>
        Next
      </Button>
    </div>
  );
}
