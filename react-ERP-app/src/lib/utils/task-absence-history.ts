const TASK_HISTORY_KEY = "employee-task-history";
const MAX_HISTORY = 12;

/**
 * Загружает историю задач из localStorage
 */
export function loadTaskHistory(): string[] {
  const stored = localStorage.getItem(TASK_HISTORY_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.error("Failed to parse task history:", e);
    }
  }
  return [];
}

/**
 * Сохраняет новые задачи в localStorage
 * @param currentHistory текущий список задач
 * @param newTasks новые задачи для добавления
 * @returns обновлённый список задач
 */
export function saveTaskHistory(
  currentHistory: string[],
  newTasks: string[]
): string[] {
  const filteredNewTasks = newTasks.map((t) => t.trim()).filter(Boolean); // убираем пустые
  const combined = Array.from(
    new Set([...currentHistory, ...filteredNewTasks])
  ); // уникальные
  const limited = combined.slice(-MAX_HISTORY); // максимум MAX_HISTORY
  localStorage.setItem(TASK_HISTORY_KEY, JSON.stringify(limited));
  return limited;
}
