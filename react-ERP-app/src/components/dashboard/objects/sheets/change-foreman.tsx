import type { Object } from "@/types/object";
import { ForemanAutocomplete } from "../../select-foreman-for-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useGetFreeForemen } from "@/hooks/user/useGetFreeForemen";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useObjectSheetStore } from "@/stores/objects-sheet-store";
import { useChangeForeman } from "@/hooks/object/useChangeForeman";
import { Button } from "@/components/ui/button";

type ObjectDetailsProps = { object: Object };

const tabletSchema = z.object({
  userId: z.string().min(1, "Выбор нового бригадира обязателен"), // Может быть null
});

type FormData = z.infer<typeof tabletSchema>;

export function ChangeForeman({ object }: ObjectDetailsProps) {
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(tabletSchema),
    defaultValues: {
      userId: "",
    },
  });

  const { closeSheet } = useObjectSheetStore();
  const { data: foremen = [] } = useGetFreeForemen();
  const { mutate: changeForeman, isPending } = useChangeForeman(object.id);
  const selectedUserId = watch("userId");

  const onSubmit = (data: FormData) => {
    changeForeman(
      {
        userId: data.userId,
      },
      {
        onSuccess: () => {
          reset();
          closeSheet();
        },
      }
    );
  };

  return (
    <>
      <div className="p-5 flex flex-col gap-1">
        <p>
          Наименование: <span className="font-medium">{object.name}</span>
        </p>
        <p>
          Адрес: <span className="font-medium">{object.address}</span>
        </p>
        <p>
          Бригадир :{" "}
          <span className="font-medium">
            {object.foreman
              ? `${object.foreman.firstName} ${object.foreman.lastName}`
              : "-"}
          </span>
        </p>
        <p>
          Телефон:{" "}
          <span className="font-medium">
            {object.foreman ? object.foreman.phone : "-"}
          </span>
        </p>
        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
        <p className="text-center font-medium text-xl mt-5">Смена бригадира</p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 m-auto w-[700px]"
        >
          <div className="flex justify-between mt-10">
            <div className="flex flex-col gap-2 ">
              <Label>Старый бригадир</Label>
              <div className="flex items-center gap-8">
                <Input
                  className="w-[300px]"
                  disabled
                  value={
                    object.foreman
                      ? `${object.foreman.lastName} ${object.foreman.firstName}`
                      : ""
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Новый бригадир *</Label>
              <div className="flex items-center gap-8">
                <ForemanAutocomplete
                  foremen={foremen}
                  onSelectChange={(userId) =>
                    setValue("userId", userId, { shouldValidate: true })
                  }
                  selectedUserId={selectedUserId}
                />
              </div>
              {errors.userId && (
                <p className="text-sm text-red-500">{errors.userId.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <Button type="submit" className="w-[300px]" disabled={isPending}>
              {isPending ? "Сохранение..." : "Сменить"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
