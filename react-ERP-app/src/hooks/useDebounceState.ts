import { useState, useEffect } from "react";

export function useDebouncedState(
  initialValue: string,
  delay = 500
): [string, (val: string) => void, string] {
  const [localValue, setLocalValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(localValue);
    }, delay);

    return () => clearTimeout(handler);
  }, [localValue, delay]);

  return [localValue, setLocalValue, debouncedValue];
}
