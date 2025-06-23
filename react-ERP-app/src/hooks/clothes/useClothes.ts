import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  getFilteredClothes,
  getClothesById,
  createClothes,
  updateClothes,
  transferClothes,
  confirmClothesTransfer,
  writeOffClothes,
  deleteClothes,
  addClothes,
  giveClothes,
  getClothesHistory,
} from "@/services/api/clothes.api";
import type {
  CreateClothesDto,
  UpdateClothesDto,
  TransferClothesDto,
  WriteOffClothesDto,
  AddClothesDto,
  GiveClothingDto,
} from "@/types/dto/clothes.dto";
import type { Clothes, ClothesType, Seasons } from "@/types/clothes";

// Хук для списка одежды с фильтрами
export const useClothes = (
  params: {
    type: ClothesType;
    searchQuery: string;
    objectId?: string | null;
    season?: Seasons | null;
  },
  enabled = true
) => {
  return useQuery({
    queryKey: ["clothes", params],
    queryFn: () => getFilteredClothes(params),
    enabled,
  });
};

// Хук для получения одежды по ID
export const useClothesById = (id: string) =>
  useQuery({
    queryKey: ["clothes", id],
    queryFn: () => getClothesById(id),
    enabled: !!id,
  });

// Создание одежды
export const useCreateClothes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClothesDto) => createClothes(data),
    onSuccess: (data) => {
      toast.success(`Одежда «${data.name}» успешно создана`);
      queryClient.invalidateQueries({ queryKey: ["clothes"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Не удалось создать одежду";
      toast.error(message);
    },
  });
};

// Обновление одежды
export const useUpdateClothes = (clothesId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Clothes, unknown, UpdateClothesDto>({
    mutationFn: (data) => updateClothes(clothesId, data),
    onSuccess: (data) => {
      toast.success(`Одежда «${data.name}» успешно обновлена`);
      queryClient.invalidateQueries({ queryKey: ["clothes"] });
      queryClient.invalidateQueries({ queryKey: ["clothes", clothesId] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Не удалось обновить одежду";
      toast.error(message);
    },
  });
};

// Передача одежды сотруднику
export const useTransferClothes = (clothesId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransferClothesDto) => transferClothes(clothesId, data),
    onSuccess: () => {
      toast.success("Одежда успешно передана");
      queryClient.invalidateQueries({ queryKey: ["clothes"] });
      queryClient.invalidateQueries({ queryKey: ["clothes", clothesId] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Не удалось передать одежду";
      toast.error(message);
    },
  });
};

// Подтверждение передачи одежды
export const useConfirmClothesTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      confirmClothesTransfer(id, quantity),
    onSuccess: (_, { id }) => {
      toast.success("Передача одежды подтверждена");
      queryClient.invalidateQueries({ queryKey: ["clothes"] });
      queryClient.invalidateQueries({ queryKey: ["clothes", id] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Не удалось подтвердить передачу";
      toast.error(message);
    },
  });
};

// Списание одежды
export const useWriteOffClothes = (clothesId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WriteOffClothesDto) => writeOffClothes(clothesId, data),
    onSuccess: () => {
      toast.success("Одежда успешно списана");
      queryClient.invalidateQueries({ queryKey: ["clothes"] });
      queryClient.invalidateQueries({ queryKey: ["clothes", clothesId] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Не удалось списать одежду";
      toast.error(message);
    },
  });
};

// Добавление одежды
export const useAddClothes = (clothesId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddClothesDto) => addClothes(clothesId, data),
    onSuccess: () => {
      toast.success("Одежда успешно добавлена");
      queryClient.invalidateQueries({ queryKey: ["clothes"] });
      queryClient.invalidateQueries({ queryKey: ["clothes", clothesId] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Не удалось добавить одежду";
      toast.error(message);
    },
  });
};

// Выдача одежды
export const useGiveClothes = (clothesId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GiveClothingDto) => giveClothes(clothesId, data),
    onSuccess: () => {
      toast.success("Одежда успешно выдана");
      queryClient.invalidateQueries({ queryKey: ["clothes"] });
      queryClient.invalidateQueries({ queryKey: ["clothes", clothesId] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Не удалось выдать одежду";
      toast.error(message);
    },
  });
};

// Удаление одежды
export function useDeleteClothes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clothesId: string) => deleteClothes(clothesId),
    onSuccess: () => {
      toast.success("Одежда успешно удалена");
      queryClient.invalidateQueries({ queryKey: ["clothes"] });
    },
    onError: (error) => {
      console.error("Ошибка при удалении одежды:", error);
      toast.error("Не удалось удалить одежду");
    },
  });
}

export const useGetClothesHistory = (clothesId: string) => {
  return useQuery({
    queryKey: ["clothes-history"],
    queryFn: () => getClothesHistory(clothesId),
  });
};
