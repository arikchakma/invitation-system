import { ForwardedRef, forwardRef } from 'react';
import cn from 'clsx';
import { useDownKeysStore } from '@/lib/stores/use-down-keys-store';

type KBDProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLUnknownElement>;

const KBD: React.FC<KBDProps> = forwardRef(
  ({ children, className }, ref: ForwardedRef<HTMLUnknownElement>) => {
    const downKeys = useDownKeysStore(state => state.downKeys);
    const key = children as string;
    const isDown = downKeys.has(key);
    return (
      <kbd
        className={cn(
          'inline-flex h-[22px] px-1.5 text-sm select-none items-center justify-center rounded border border-gray-600 bg-gray-200 uppercase text-gray-900',
          isDown && 'opacity-70',
          className
        )}
      >
        {children}
      </kbd>
    );
  }
);

KBD.displayName = 'KBD';

export { KBD };
export default KBD;
