export interface CreateWorkLogItemDto {
  text: string;
}

export interface CreateWorkLogDto {
  date: string;
  objectId: string;
  items: CreateWorkLogItemDto[];
  photos?: File[]; // Именно File (из input), а не строки URL
}

export interface GetWorkLogFilterDto {
  year: number;
  month: number;
}

export interface UpdateWorkLogDto {
  date?: string;
  items?: { text: string }[];
  photos?: File[];
  removedPhotoIds?: string[];
}
