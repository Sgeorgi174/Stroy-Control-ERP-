import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  createObjectDocument,
  deleteObjectDocument,
  getObjectDocuments,
  updateObjectDocument,
} from "@/services/api/object-document.api";
import type { ObjectDocument } from "@/types/object-document";
import type {
  CreateObjectDocumentDto,
  GetObjectDocumentFilters,
  UpdateObjectDocumentDto,
} from "@/types/dto/object-document.dto";
import type { AppAxiosError } from "@/types/error-response";

const KEY = "object-documents";

export const useObjectDocuments = (
  objectId: string,
  filters: GetObjectDocumentFilters,
) => {
  return useQuery<ObjectDocument[]>({
    queryKey: [KEY, objectId, filters],
    queryFn: () => getObjectDocuments(objectId, filters),
    enabled: !!objectId,
  });
};

export const useCreateObjectDocument = (objectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateObjectDocumentDto) => createObjectDocument(data),
    onSuccess: () => {
      toast.success("Документ успешно добавлен");
      queryClient.invalidateQueries({ queryKey: [KEY, objectId] });
    },
    onError: (error: AppAxiosError) => {
      const message =
        error?.response?.data?.message || "Ошибка при создании документа";
      toast.error(message);
    },
  });
};

export const useUpdateObjectDocument = (objectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateObjectDocumentDto }) =>
      updateObjectDocument(id, data),
    onSuccess: () => {
      toast.success("Документ обновлен");
      queryClient.invalidateQueries({ queryKey: [KEY, objectId] });
    },
    onError: (error: AppAxiosError) => {
      const message = error?.response?.data?.message || "Ошибка при обновлении";
      toast.error(message);
    },
  });
};

export const useDeleteObjectDocument = (objectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteObjectDocument(id),
    onSuccess: () => {
      toast.success("Документ удален");
      queryClient.invalidateQueries({ queryKey: [KEY, objectId] });
    },
    onError: () => {
      toast.error("Не удалось удалить документ");
    },
  });
};
