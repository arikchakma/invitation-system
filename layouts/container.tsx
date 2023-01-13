import Header from './header';
import MaxWidthWrapper from './max-width-wrapper';

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <main className="mt-20">
      <MaxWidthWrapper>
        <Header />
      </MaxWidthWrapper>
      {children}
    </main>
  );
}
