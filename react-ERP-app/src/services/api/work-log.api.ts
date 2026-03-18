import { api } from "@/lib/api";
import type { WorkLog } from "@/types/work-log";
import type {
  CreateWorkLogDto,
  GetWorkLogFilterDto,
} from "@/types/dto/work-log.dto";

// Создать запись в журнале
export const createWorkLog = async (
  data: CreateWorkLogDto,
): Promise<WorkLog> => {
  const res = await api.post("/work-log/create", data);
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

// Удалить запись
export const deleteWorkLog = async (id: string): Promise<void> => {
  await api.delete(`/work-log/delete/${id}`);
};
