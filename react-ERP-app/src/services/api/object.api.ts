// services/api/object.api.ts
import type { Object } from "@/types/object"; // создай этот тип
import type { CreateObjectDto, UpdateObjectDto } from "@/types/dto/object.dto";
import { api } from "@/lib/api";

export const getAllObjects = async (): Promise<Object[]> => {
  const res = await api.get("/objects/all");
  return res.data;
};

export const getObjectById = async (id: string): Promise<Object> => {
  const res = await api.get(`/objects/by-id/${id}`);
  return res.data;
};

export const getObjectByUser = async (): Promise<Object> => {
  const res = await api.get("/objects/user");
  return res.data;
};

export const createObject = async (dto: CreateObjectDto): Promise<Object> => {
  const res = await api.post("/objects/create", dto);
  return res.data;
};

export const updateObject = async (
  id: string,
  dto: UpdateObjectDto
): Promise<Object> => {
  const res = await api.put(`/objects/update/${id}`, dto);
  return res.data;
};

export const deleteObject = async (id: string): Promise<void> => {
  await api.delete(`/objects/delete/${id}`);
};
