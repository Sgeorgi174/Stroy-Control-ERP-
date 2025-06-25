import { Button } from "@/components/ui/button";

type FinalStepProps = {
  handleClick: () => void;
};

export function FinalStep({ handleClick }: FinalStepProps) {
  return (
    <div className="mt-6 flex p-7 flex-col">
      <p>Final</p>
      <Button className="mt-6" onClick={handleClick}>
        Finish
      </Button>
    </div>
  );
}
