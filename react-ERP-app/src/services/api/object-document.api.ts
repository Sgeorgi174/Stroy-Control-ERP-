import { api } from "@/lib/api";
import type { ObjectDocument } from "@/types/object-document";
import type {
  CreateObjectDocumentDto,
  GetObjectDocumentFilters,
  UpdateObjectDocumentDto,
} from "@/types/dto/object-document.dto";

const BASE_URL = "/object-documents";

export const createObjectDocument = async (
  data: CreateObjectDocumentDto,
): Promise<ObjectDocument> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("type", data.type);
  formData.append("objectId", data.objectId);
  if (data.comment) formData.append("comment", data.comment);

  // Добавляем массивы ID
  data.toolIds?.forEach((id) => formData.append("toolIds", id));
  data.deviceIds?.forEach((id) => formData.append("deviceIds", id));

  if (data.file) {
    formData.append("file", data.file);
  }

  const res = await api.post(`${BASE_URL}/create`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getObjectDocuments = async (
  objectId: string,
  filters: GetObjectDocumentFilters,
): Promise<ObjectDocument[]> => {
  const res = await api.get(`${BASE_URL}/object/${objectId}`, {
    params: filters,
  });
  return res.data;
};

export const updateObjectDocument = async (
  id: string,
  data: UpdateObjectDocumentDto,
): Promise<ObjectDocument> => {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.type) formData.append("type", data.type);
  if (data.comment) formData.append("comment", data.comment);

  data.toolIds?.forEach((id) => formData.append("toolIds", id));
  data.deviceIds?.forEach((id) => formData.append("deviceIds", id));

  if (data.file) {
    formData.append("file", data.file);
  }

  const res = await api.patch(`${BASE_URL}/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteObjectDocument = async (id: string): Promise<void> => {
  await api.delete(`${BASE_URL}/delete/${id}`);
};
