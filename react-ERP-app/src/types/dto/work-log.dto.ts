export interface CreateWorkLogItemDto {
  text: string;
}

export interface CreateWorkLogDto {
  date: string; // ISO string
  objectId: string;
  items: CreateWorkLogItemDto[];
  photos?: string[]; // Массив URL после загрузки
}

export interface GetWorkLogFilterDto {
  year: number;
  month: number;
}
