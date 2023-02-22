import { cn } from '@/utils/cn';

export default function ChatSkeleton() {
  return (
    <div className="grid grid-rows-[1fr_280px_1fr]">
      <div className="w-full animate-pulse rounded bg-gray-100 p-2 font-semibold text-gray-800">
        <div className="h-9 w-1/2 rounded bg-gray-300" />
        <div className="mt-0.5 h-5 rounded bg-gray-300/80" />
      </div>
      <div className="relative h-full overflow-hidden">
        <ul className="flex h-full flex-col justify-end divide-y divide-gray-200">
          {new Array(6).fill(0).map((_, index) => (
            <li
              key={index}
              className="animate-pulse"
              style={{
                animationDelay: `0.${index}s`,
              }}
            >
              <div
                className={cn(
                  'flex flex-col p-2',
                  index % 2 === 0 ? 'items-end' : 'items-start'
                )}
              >
                <p
                  className={cn(
                    'h-4 rounded bg-gray-300',
                    index % 2 === 0 ? 'w-[180px]' : 'w-[120px]'
                  )}
                />
                <p
                  className="mt-0.5 h-6 rounded bg-gray-400"
                  style={{
                    width: `${Math.floor(Math.random() * 100) + 10}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
        <div
          aria-label="Messages overflow overlay"
          aria-hidden
          className={cn(
            'pointer-events-none absolute bottom-0 h-full w-full touch-none',
            'before:absolute before:top-0 before:h-20 before:w-full before:bg-gradient-to-b before:from-white before:to-transparent'
          )}
        />
      </div>
      <div className="flex animate-pulse gap-2">
        <div className="h-10 grow rounded bg-gray-200" />
        <div className="h-10 w-20 rounded bg-gray-600" />
      </div>
    </div>
  );
}
