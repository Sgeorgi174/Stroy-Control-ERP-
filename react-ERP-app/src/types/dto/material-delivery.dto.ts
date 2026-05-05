export interface CreateMaterialDeliveryDto {
  date: string;
  objectId: string;
  photos?: File[]; // Файлы из input
}

export interface GetMaterialDeliveryFilterDto {
  year: number;
  month: number;
}

export interface UpdateMaterialDeliveryDto {
  date?: string;
  // Массив URL фотографий, которые пользователь ОСТАВИЛ
  existingPhotos?: string[];
  // Новые файлы из input
  photos?: File[];
}
