import { api } from "@/lib/api";
import type {
  CreateMaterialDeliveryDto,
  GetMaterialDeliveryFilterDto,
  UpdateMaterialDeliveryDto,
} from "@/types/dto/material-delivery.dto";
import type { MaterialDelivery } from "@/types/material-delivery";

// Создать запись
export const createMaterialDelivery = async (
  data: CreateMaterialDeliveryDto,
): Promise<MaterialDelivery> => {
  const formData = new FormData();
  formData.append("date", data.date);
  formData.append("objectId", data.objectId);

  if (data.photos) {
    data.photos.forEach((file) => formData.append("photos", file));
  }

  const res = await api.post("/material-deliveries/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Получить архив за месяц
export const getMaterialDeliveryArchive = async (
  objectId: string,
  filters: GetMaterialDeliveryFilterDto,
): Promise<MaterialDelivery[]> => {
  const res = await api.get(`/material-deliveries/object/${objectId}`, {
    params: filters,
  });
  return res.data;
};

// Обновить запись
export const updateMaterialDelivery = async (
  id: string,
  data: UpdateMaterialDeliveryDto,
): Promise<MaterialDelivery> => {
  const formData = new FormData();
  if (data.date) formData.append("date", data.date);

  if (data.existingPhotos) {
    formData.append("existingPhotos", JSON.stringify(data.existingPhotos));
  }

  if (data.photos) {
    data.photos.forEach((file) => formData.append("photos", file));
  }

  const res = await api.patch(`/material-deliveries/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Удалить запись
export const deleteMaterialDelivery = async (id: string): Promise<void> => {
  await api.delete(`/material-deliveries/delete/${id}`);
};
