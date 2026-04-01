import { api } from "@/lib/api";
import type { WorkLog } from "@/types/work-log";
import type {
  CreateWorkLogDto,
  GetWorkLogFilterDto,
  UpdateWorkLogDto,
} from "@/types/dto/work-log.dto";

// Создать запись в журнале
export const createWorkLog = async (
  data: CreateWorkLogDto,
): Promise<WorkLog> => {
  const formData = new FormData();

  formData.append("date", data.date);
  formData.append("objectId", data.objectId);

  // Массив объектов превращаем в JSON-строку
  // (на бэкенде наш @Transform его распарсит)
  formData.append("items", JSON.stringify(data.items));

  // Добавляем файлы
  if (data.photos) {
    data.photos.forEach((file) => {
      formData.append("photos", file);
    });
  }

  const res = await api.post("/work-log/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Получить архив за месяц
export const getWorkLogArchive = async (
  objectId: string,
  filters: GetWorkLogFilterDto,
): Promise<WorkLog[]> => {
  const res = await api.get(`/work-log/object/${objectId}`, {
    params: filters,
  });
  return res.data;
};

// Получить дни с записями для календаря
export const getCalendarHighlights = async (
  objectId: string,
  filters: GetWorkLogFilterDto,
): Promise<number[]> => {
  const res = await api.get(
    `/work-log/object/${objectId}/calendar-highlights`,
    { params: filters },
  );
  return res.data;
};

// 🔹 Обновить запись
export const updateWorkLog = async (
  id: string,
  data: UpdateWorkLogDto,
): Promise<WorkLog> => {
  const formData = new FormData();

  if (data.date) {
    formData.append("date", data.date);
  }

  if (data.items) {
    formData.append("items", JSON.stringify(data.items));
  }

  if (data.removedPhotoIds) {
    formData.append("removedPhotoIds", JSON.stringify(data.removedPhotoIds));
  }

  if (data.photos) {
    data.photos.forEach((file) => {
      formData.append("photos", file);
    });
  }

  const res = await api.patch(`/work-log/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// Удалить запись
export const deleteWorkLog = async (id: string): Promise<void> => {
  await api.delete(`/work-log/delete/${id}`);
};
