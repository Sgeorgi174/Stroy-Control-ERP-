import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { CreateClothesRequestDto } from "@/types/dto/clothes-request.dto";
import type { User } from "@/types/user";
import { CustomerSelectForRequest } from "../request-customer-select";

type Props = {
  form: CreateClothesRequestDto;
  setForm: React.Dispatch<React.SetStateAction<CreateClothesRequestDto>>;
  users: User[];
};

export function Step1MainInfo({ form, setForm, users }: Props) {
  const toggleUser = (id: string) => {
    const exists = form.participantsIds?.includes(id);

    setForm({
      ...form,
      participantsIds: exists
        ? form.participantsIds?.filter((u) => u !== id)
        : [...(form.participantsIds || []), id],
    });
  };

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

        <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
          {users.map((user: User) => (
            <label
              key={user.id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={form.participantsIds?.includes(user.id)}
                onChange={() => toggleUser(user.id)}
              />

              <span>
                {user.lastName} {user.firstName}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
