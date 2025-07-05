import { Checkbox } from "@/components/ui/checkbox";

type ConfirmCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function ConfirmCheckbox({ checked, onChange }: ConfirmCheckboxProps) {
  return (
    <div
      className={`flex items-center space-x-2 mb-4 p-3 ${
        checked ? "bg-green-500/40" : "bg-attention"
      } rounded-lg`}
    >
      <Checkbox
        className="border-accent-foreground"
        id="confirm-responsibility"
        checked={checked}
        onCheckedChange={(val) => onChange(val as boolean)}
      />
      <label
        htmlFor="confirm-responsibility"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Я подтверждаю, что получил указанный инвентарь.
      </label>
    </div>
  );
}
