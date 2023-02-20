import { useCallback, useEffect, useMemo } from 'react';

type KeyHandler = (keys: Set<string>, event: KeyboardEvent) => void;

export function useHotkeysHandler(
  keys: string[],
  handler: KeyHandler,
  keyUpHandler?: KeyHandler
) {
  const downKeys = useMemo(() => new Set<string>(), []);

  const downHandler = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.repeat
      ) {
        return;
      }

      downKeys.add(event.key);
      if (keys.every(key => downKeys.has(key))) {
        handler(downKeys, event);
      }
    },
    [downKeys, handler, keys]
  );

  const upHandler = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.repeat
      ) {
        return;
      }

      downKeys.delete(event.key);
      if (keyUpHandler) {
        keyUpHandler(downKeys, event);
      }
    },
    [downKeys, keyUpHandler]
  );

  useEffect(() => {
    document.addEventListener('keydown', downHandler);
    document.addEventListener('keyup', upHandler);
    return () => {
      document.removeEventListener('keydown', downHandler);
      document.removeEventListener('keyup', upHandler);
    };
  }, [downHandler, upHandler]);

  return downKeys;
}
