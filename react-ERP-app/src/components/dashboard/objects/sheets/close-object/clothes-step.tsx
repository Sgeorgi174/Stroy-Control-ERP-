import { Button } from "@/components/ui/button";

type ClotheseStepProps = {
  handleClick: () => void;
};

export function ClotheseStep({ handleClick }: ClotheseStepProps) {
  return (
    <div className="mt-6 flex p-7 flex-col">
      <p>Clothes</p>
      <Button className="mt-6" onClick={handleClick}>
        Next
      </Button>
    </div>
  );
}
