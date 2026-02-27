import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { CreateClothesRequestDto } from "@/types/dto/clothes-request.dto";
import type { User } from "@/types/user";
import { CustomerSelectForRequest } from "../request-customer-select";
import { useEffect } from "react";

type Props = {
  form: CreateClothesRequestDto;
  setForm: React.Dispatch<React.SetStateAction<CreateClothesRequestDto>>;
  users: User[];
  onValidityChange?: (isValid: boolean) => void;
  me: User;
};

export function Step1MainInfo({
  form,
  setForm,
  users,
  onValidityChange,
  me,
}: Props) {
  useEffect(() => {
    if (!form.participantsIds?.includes(me.id)) {
      setForm((prev) => ({
        ...prev,
        participantsIds: [...(prev.participantsIds || []), me.id],
      }));
    }
  }, [me.id, form.participantsIds, setForm]);

  const toggleUser = (id: string) => {
    const exists = form.participantsIds?.includes(id);

    setForm({
      ...form,
      participantsIds: exists
        ? form.participantsIds?.filter((u) => u !== id)
        : [...(form.participantsIds || []), id],
    });
  };

  const participants = form.participantsIds ?? [];

  const hasOtherParticipants = participants.some((id) => id !== me.id);

  const isValid =
    form.title?.trim().length > 0 && !!form.customer && hasOtherParticipants;

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  return (
    <div className="space-y-6">
      {/* Основная информация */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Название заявки</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Заказчик</Label>
          <CustomerSelectForRequest
            selectedCustomer={form.customer}
            onSelectChange={(val) => setForm({ ...form, customer: val })}
            className="w-full"
          />
        </div>
      </div>

      {/* Участники */}
      <div>
        <Label className="mb-2 block">Участники</Label>

        <div className="border rounded-lg p-4 max-h-45 overflow-y-auto space-y-3 flex flex-col flex-wrap">
          {users.map((user: User) => {
            const isMe = user.id === me.id;
            const participants = form.participantsIds ?? [];
            const checked = isMe || participants.includes(user.id);

            const checkboxId = `participant-${user.id}`;

            return (
              <div key={user.id} className="flex items-center space-x-3">
                <Checkbox
                  id={checkboxId}
                  checked={checked}
                  disabled={isMe}
                  onCheckedChange={() => toggleUser(user.id)}
                />

                <Label htmlFor={checkboxId} className="cursor-pointer">
                  {user.lastName} {user.firstName}
                  {isMe && " (Вы)"}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
