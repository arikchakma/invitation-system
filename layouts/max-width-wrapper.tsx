import cn from 'clsx';

export default function MaxWidthWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('w-full max-w-7xl mx-auto px-20', className)}>
      {children}
    </div>
  );
}
