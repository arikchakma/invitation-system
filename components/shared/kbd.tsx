import { ForwardedRef, forwardRef } from 'react';
import cn from 'clsx';

type KBDProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLUnknownElement>;

const KBD: React.FC<KBDProps> = forwardRef(
  ({ children, className }, ref: ForwardedRef<HTMLUnknownElement>) => {
    return (
      <kbd
        className={cn(
          'inline-flex h-[22px] w-[22px] text-sm select-none items-center justify-center rounded border border-slate-600 bg-slate-200 uppercase text-slate-900',
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
