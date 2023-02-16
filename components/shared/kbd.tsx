import { ForwardedRef, forwardRef, useState } from 'react';
import cn from 'clsx';
import { useHotkeysHandler } from '@/utils/use-hotkeys-handler';

type KBDProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLUnknownElement>;

const KBD: React.FC<KBDProps> = forwardRef(
  ({ children, className }, ref: ForwardedRef<HTMLUnknownElement>) => {
    const [isDown, setIsDown] = useState(false)
    const key = children as string;
    useHotkeysHandler([key], () => {
      setIsDown(true)
    }, () => {
      setIsDown(false)
    },);
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
