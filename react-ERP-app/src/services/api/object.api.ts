// services/api/object.api.ts
import type { Object, ObjectStatus } from "@/types/object"; // создай этот тип
import type {
  ChangeForemanDto,
  CreateCustomerDto,
  CreateObjectDto,
  UpdateCustomerDto,
  UpdateObjectDto,
} from "@/types/dto/object.dto";
import { api } from "@/lib/api";
import type { ObjectToCloseResponse } from "@/types/objectToCloseResponse";

export const getFilteredObjects = async (params: {
  searchQuery: string;
  status?: ObjectStatus | null;
}) => {
  const res = await api.get("/objects/filter", {
    params: {
      searchQuery: params.searchQuery || undefined,
      status: params.status || undefined,
    },
  });
  return res.data;
};

export const getObjectById = async (id: string): Promise<Object> => {
  const res = await api.get(`/objects/by-id/${id}`);
  return res.data;
};

export const getObjectByIdToClose = async (
  id: string,
): Promise<ObjectToCloseResponse> => {
  const res = await api.get(`/objects/close-object/${id}`);
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
  dto: UpdateObjectDto,
): Promise<Object> => {
  const res = await api.put(`/objects/update/${id}`, dto);
  return res.data;
};

export const deleteObject = async (id: string): Promise<void> => {
  await api.delete(`/objects/delete/${id}`);
};

export const closeObject = async (id: string): Promise<void> => {
  await api.patch(`/objects/close/${id}`);
};

export const changeForeman = async (
  id: string,
  dto: ChangeForemanDto,
): Promise<Object> => {
  const res = await api.patch(`/objects/change-foreman/${id}`, dto);
  return res.data;
};

export const removeForeman = async (id: string): Promise<Object> => {
  const res = await api.patch(`/objects/remove-foreman/${id}`);
  return res.data;
};

export const getAllCustomers = async (): Promise<
  { id: string; name: string; shortName: string | null }[]
> => {
  const res = await api.get("/objects/customers");
  return res.data;
};

export const createCustomer = async (data: CreateCustomerDto) => {
  const res = await api.post("/objects/customer-create", data);
  return res.data;
};

export const updateCustomer = async (id: string, data: UpdateCustomerDto) => {
  const res = await api.put(`/objects/customer-update/${id}`, data);
  return res.data;
};

export const deleteCustomer = async (id: string) => {
  await api.delete(`/objects/customer-delete/${id}`);
};

// ================= pause/unpause =================
export const pauseObject = async (id: string): Promise<void> => {
  await api.patch(`/objects/pause-object/${id}`);
};

export const unpauseObject = async (id: string): Promise<void> => {
  await api.patch(`/objects/unpause-object/${id}`);
};
