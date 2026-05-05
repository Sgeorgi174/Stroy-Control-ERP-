import type { ObjectDocType } from "../object-document";

// types/dto/object-document.dto.ts
export interface CreateObjectDocumentDto {
  name: string;
  type: ObjectDocType;
  objectId: string;
  comment?: string;
  toolIds?: string[];
  deviceIds?: string[];
  file?: File; // Поле для загрузки файла
}

export interface GetObjectDocumentFilters {
  type?: string; // 'ALL' или конкретный тип
  search?: string;
}

export interface UpdateObjectDocumentDto {
  name: string;
  type: ObjectDocType;
  objectId: string;
  comment?: string;
  toolIds?: string[];
  deviceIds?: string[];
  file?: File; // Поле для загрузки файла
}
