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
  requestClothesPhotoByTransferId,
  rejectClothesTransfer,
  resendClothesTransfer,
  returnClothesToSource,
  writeOffClothesInTransfer,
  cancelClothesTransfer,
} from "@/services/api/clothes.api";
import type {
  CreateClothesDto,
  UpdateClothesDto,
  TransferClothesDto,
  WriteOffClothesDto,
  AddClothesDto,
  GiveClothingDto,
  ConfirmTransferClothesDto,
  RejectClotheseDto,
  ResendClothesTransferDto,
  WirteOffClothesInTransferDto,
  CancelClothesTransferDto,
} from "@/types/dto/clothes.dto";
import type { ClothesType, Seasons } from "@/types/clothes";
import type { AppAxiosError } from "@/types/error-response";

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
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось создать одежду";
      toast.error(message);
    },
  });
};

// Обновление одежды
export const useUpdateClothes = (clothesId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateClothesDto) => updateClothes(clothesId, data),
    onSuccess: (data) => {
      toast.success(`Одежда «${data.name}» успешно обновлена`);
      queryClient.invalidateQueries({ queryKey: ["clothes"] });
      queryClient.invalidateQueries({ queryKey: ["clothes", clothesId] });
    },
    onError: (error: AppAxiosError) => {
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
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось передать одежду";
      toast.error(message);
    },
  });
};

// Подтверждение передачи одежды
export const useConfirmClothesTransfer = (transferId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ConfirmTransferClothesDto) =>
      confirmClothesTransfer(transferId, dto.quantity),
    onSuccess: () => {
      toast.success(`Перемещение успешно подтверждено`);
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["user-returns"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось подтвердить перемещение";
      toast.error(message);
    },
  });
};

export const useRejectClothesTransfer = (transferId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RejectClotheseDto) =>
      rejectClothesTransfer(transferId, data),
    onSuccess: () => {
      toast.success(`Вы успешно отклонили перемещение`);
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось отклонить перемещение";
      toast.error(message);
    },
  });
};

export const useResendClothesTransfer = (transferId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResendClothesTransferDto) =>
      resendClothesTransfer(transferId, data),
    onSuccess: () => {
      toast.success(`Вы успешно переотправили спецодежду`);
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message ||
        "Не удалось создать новое перемещение";
      toast.error(message);
    },
  });
};

export const useReturnClothesToSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transferId: string) => returnClothesToSource(transferId),
    onSuccess: () => {
      toast.success(`Вы успешно переотправили спецодежду`);
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message ||
        "Не удалось создать новое перемещение";
      toast.error(message);
    },
  });
};

export const useWriteOffClothesInTransfer = (transferId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WirteOffClothesInTransferDto) =>
      writeOffClothesInTransfer(transferId, data),
    onSuccess: () => {
      toast.success(`Вы успешно списали спецодежду`);
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось списать спецодежду";
      toast.error(message);
    },
  });
};

export const useCancelClothesTransfer = (transferId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CancelClothesTransferDto) =>
      cancelClothesTransfer(transferId, data),
    onSuccess: () => {
      toast.success(`Перемещение успешно отменено`);
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось отменить перемещение";
      toast.error(message);
    },
  });
};

export const useRequestClothesPhoto = () => {
  return useMutation({
    mutationFn: (transferId: string) =>
      requestClothesPhotoByTransferId(transferId),
    onSuccess: () => {
      toast.success(`Бот ожидает фото комплектов одежды или обуви`);
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Не удалось инициализировать бота";
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
    onError: (error: AppAxiosError) => {
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
    onError: (error: AppAxiosError) => {
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
    onError: (error: AppAxiosError) => {
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
    queryKey: ["clothes-history", clothesId],
    queryFn: () => getClothesHistory(clothesId),
  });
};
