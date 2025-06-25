import { Button } from "@/components/ui/button";

type ToolsStepProps = {
  handleClick: () => void;
};

export function ToolsStep({ handleClick }: ToolsStepProps) {
  return (
    <div className="mt-6 flex p-7 flex-col">
      <p>Tools</p>
      <Button className="mt-6" onClick={handleClick}>
        Next
      </Button>
    </div>
  );
}
