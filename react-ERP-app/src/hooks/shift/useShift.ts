import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  createShift,
  updateShift,
  getShiftsByObject,
  getShiftsWithFilters,
} from "@/services/api/shift.api";
import type {
  CreateShiftDto,
  GetShiftsFilterDto,
  UpdateShiftDto,
} from "@/types/dto/shift.dto";
import type { AppAxiosError } from "@/types/error-response";

// Создать смену
export const useCreateShift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateShiftDto) => createShift(data),
    onSuccess: () => {
      toast.success(`Смена на сегодня успешно создана`);
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    onError: (error: AppAxiosError) => {
      toast.error(error?.response?.data?.message || "Не удалось создать смену");
    },
  });
};

// Обновить смену
export const useUpdateShift = (shiftId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateShiftDto) => updateShift(shiftId, data),
    onSuccess: (data) => {
      toast.success(`Смена на ${data.shiftDate} успешно обновлена`);
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({ queryKey: ["shift", shiftId] });
    },
    onError: (error: AppAxiosError) => {
      toast.error(
        error?.response?.data?.message || "Не удалось обновить смену"
      );
    },
  });
};

// Получить смены по объекту
export const useShiftsByObject = (objectId: string) => {
  return useQuery({
    queryKey: ["shifts", "object", objectId],
    queryFn: () => getShiftsByObject(objectId),
  });
};

// Получить смены по фильтрам
export const useShiftsWithFilters = (
  filters: GetShiftsFilterDto,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ["shifts", "filter", filters],
    queryFn: () => getShiftsWithFilters(filters),
    enabled: enabled,
  });
};
