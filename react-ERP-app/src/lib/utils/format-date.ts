import { format, parseISO } from "date-fns";

export function formatDate(dateString: string) {
  return format(parseISO(dateString), "dd.MM.yyyy"); // дд.мм.гггг
}

export function formatTime(dateString: string) {
  return format(parseISO(dateString), "HH:mm"); // чч:мм (24 часа)
}
