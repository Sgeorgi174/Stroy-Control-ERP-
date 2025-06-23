"use client";

import { SelectStatusToolOrDeviceForForms } from "@/components/dashboard/select-tool-device-status";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import type { DeviceStatus } from "@/types/device";
import type { Tool } from "@/types/tool";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangeToolStatus } from "@/hooks/tool/useCahngeStatus";
import { ToolsDetailsBox } from "./tool-details-box";

type ToolsEditProps = { tool: Tool };

const schema = z.object({
  status: z.enum([
    "ON_OBJECT",
    "IN_TRANSIT",
    "IN_REPAIR",
    "LOST",
    "WRITTEN_OFF",
  ]),
  comment: z.string().min(1, "Комментарий обязателен"),
});

type FormData = z.infer<typeof schema>;

export function ToolsChangeStatus({ tool }: ToolsEditProps) {
  const { closeSheet } = useToolsSheetStore();

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: tool.status,
      comment: "",
    },
  });

  const selectedStatus = watch("status");

  const mutation = useChangeToolStatus(tool.id);

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      { status: data.status, comment: data.comment },
      {
        onSuccess: () => {
          reset();
          closeSheet();
        },
      }
    );
  };

  return (
    <div className="p-5 flex flex-col gap-1">
      <ToolsDetailsBox tool={tool} />

      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
      <p className="text-center font-medium text-xl mt-5">Смена статуса</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 mt-10">
          <div className="flex flex-col gap-2">
            <Label>Новый статус</Label>
            <SelectStatusToolOrDeviceForForms
              selectedStatus={selectedStatus}
              onSelectChange={(status) =>
                setValue("status", status as DeviceStatus)
              }
              disabled={mutation.isPending}
            />
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <div className="flex flex-col w-[400px] gap-2">
            <Label>Комментарий</Label>
            <Textarea
              {...register("comment")}
              placeholder="Укажите причину смены статуса"
              className="resize-none"
              disabled={mutation.isPending}
            />
            {errors.comment && (
              <p className="text-sm text-red-500">{errors.comment.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Button
            type="submit"
            className="w-[200px]"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Сохраняем..." : "Сменить статус"}
          </Button>
        </div>
      </form>
    </div>
  );
}
