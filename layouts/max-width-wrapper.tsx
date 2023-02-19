import cn from 'clsx';

export default function MaxWidthWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-7xl px-20 -lg:px-16 -md:px-12 -sm:px-8',
        className
      )}
    >
      {children}
    </div>
  );
}
