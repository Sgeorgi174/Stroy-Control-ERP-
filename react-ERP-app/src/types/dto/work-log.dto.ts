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
  objectId?: string;
  items: CreateWorkLogItemDto[];
  // Массив URL фотографий, которые пользователь НЕ удалил
  existingPhotos: string[];
  // Новые файлы (File) из input
  photos?: File[];
}
