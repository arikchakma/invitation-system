import { useCallback, useEffect, useMemo } from 'react';

type KeyHandler = (keys: Set<string>) => void;

export function useHotkeysHandler(
  keys: string[],
  handler: KeyHandler,
  keyUpHandler?: KeyHandler
) {
  const downKeys = useMemo(() => new Set<string>(), []);

  const downHandler = useCallback(
    (event: KeyboardEvent) => {
      downKeys.add(event.key);
      if (keys.every(key => downKeys.has(key))) {
        handler(downKeys);
      }
    },
    [downKeys, handler, keys]
  );

  const upHandler = useCallback(
    (event: KeyboardEvent) => {
      downKeys.delete(event.key);
      if (keyUpHandler) {
        keyUpHandler(downKeys);
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
