import {
  ButtonHTMLAttributes,
  CSSProperties,
  ForwardedRef,
  SVGProps,
  forwardRef,
} from 'react';
import { cn } from '@/utils/cn';
import { useNotifications } from '@/utils/use-notifications';
import { Popover, PopoverContent, PopoverTrigger } from '../shared/popover';

export default function NotificationPopover() {
  const { notifications } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger>
        <NotificationButton />
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="flex flex-col space-y-4">
          {notifications.map(notification => (
            <div
              key={notification.project.slug}
              className="flex items-center space-x-4"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.project.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const NotificationButton = forwardRef(
  (
    props: ButtonHTMLAttributes<HTMLButtonElement>,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const { count, reset } = useNotifications();
    return (
      <button
        {...props}
        ref={ref}
        aria-label="Notifications"
        className={cn(
          'relative inline-flex after:absolute after:right-0 after:top-0 after:z-10 after:h-4 after:w-4 after:translate-x-1 after:-translate-y-1 after:rounded-full after:bg-black after:text-center after:text-[10px] after:font-bold after:leading-4 after:text-white after:ring-1 after:ring-white after:content-[var(--content)]'
        )}
        style={
          {
            '--content': `"${count}"`,
          } as CSSProperties
        }
        onClick={reset}
      >
        <BellIcon className="h-5 w-5 stroke-black stroke-2" />
      </button>
    );
  }
);

NotificationButton.displayName = 'NotificationButton';

function BellIcon({
  className,
  ...props
}: { className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      />
    </svg>
  );
}
