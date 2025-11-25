import { useCallback, useEffect, useState } from "react";

type ColorsMap = Record<string, string | undefined>;
export type RowColorEntity =
  | "tool"
  | "device"
  | "tablet"
  | "clothes"
  | "tool-bulk";

export function useRowColors(entityKey: RowColorEntity) {
  const storageKey = `row-colors:${entityKey}`;
  const [colors, setColors] = useState<ColorsMap>({});

  // Load once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setColors(JSON.parse(raw));
      }
    } catch (e) {
      console.warn("Failed to parse row colors:", e);
    }
  }, [storageKey]);

  // Save changes to localStorage
  const persist = useCallback(
    (next: ColorsMap) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (e) {
        console.warn("Failed to save row colors:", e);
      }
    },
    [storageKey]
  );

  const setColor = useCallback(
    (id: string, color: string) => {
      setColors((prev) => {
        const next = { ...prev, [id]: color };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const resetColor = useCallback(
    (id: string) => {
      setColors((prev) => {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const clearAll = useCallback(() => {
    setColors({});
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.log(e);
    }
  }, [storageKey]);

  return { colors, setColor, resetColor, clearAll };
}
