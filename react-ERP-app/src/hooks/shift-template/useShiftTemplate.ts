import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  createShiftTemplate,
  updateShiftTemplate,
  getShiftTemplatesByObject,
  deleteShiftTemplate,
} from "@/services/api/shift-template.api";
import type { AppAxiosError } from "@/types/error-response";
import type {
  CreateShiftTemplateDto,
  UpdateShiftTemplateDto,
} from "@/types/dto/shift.dto";

// Создать шаблон смены
export const useCreateShiftTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateShiftTemplateDto) => createShiftTemplate(data),
    onSuccess: () => {
      toast.success(`Шаблон смены успешно создан`);
      queryClient.invalidateQueries({ queryKey: ["shift-templates"] });
    },
    onError: (error: AppAxiosError) => {
      toast.error(
        error?.response?.data?.message || "Не удалось создать шаблон смены"
      );
    },
  });
};

// Обновить шаблон смены
export const useUpdateShiftTemplate = (templateId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateShiftTemplateDto) =>
      updateShiftTemplate(templateId, data),
    onSuccess: (data) => {
      toast.success(`Шаблон "${data.name}" успешно обновлён`);
      queryClient.invalidateQueries({ queryKey: ["shift-templates"] });
      queryClient.invalidateQueries({
        queryKey: ["shift-template", templateId],
      });
    },
    onError: (error: AppAxiosError) => {
      toast.error(
        error?.response?.data?.message || "Не удалось обновить шаблон смены"
      );
    },
  });
};

// Получить шаблоны смен по объекту
export const useShiftTemplatesByObject = (
  objectId?: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["shift-templates", objectId],
    queryFn: () => getShiftTemplatesByObject(objectId as string),
    enabled: enabled && !!objectId,
  });
};

// Удалить шаблон смены
export const useDeleteShiftTemplate = (templateId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteShiftTemplate(templateId),
    onSuccess: () => {
      toast.success("Шаблон смены удалён");
      queryClient.invalidateQueries({ queryKey: ["shift-templates"] });
    },
    onError: (error: AppAxiosError) => {
      toast.error(
        error?.response?.data?.message || "Не удалось удалить шаблон смены"
      );
    },
  });
};
