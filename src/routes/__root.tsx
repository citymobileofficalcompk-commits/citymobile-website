import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
} from "@tanstack/react-router";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { BottomNav } from "@/components/BottomNav";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center bg-white px-6">
      <div className="text-center">
        <p className="text-sm font-semibold tracking-wide text-[#0F172A] uppercase">404 Error</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 max-w-md text-base leading-7 text-gray-500 mx-auto">
          The page you're looking for doesn't exist or has been moved. Check the URL or head back home.
        </p>
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-[#0F172A] px-8 py-3.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error('Routing Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center bg-white px-6">
      <div className="text-center">
        <p className="text-sm font-semibold tracking-wide text-[#0F172A] uppercase">Error</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          This page didn't load
        </h1>
        <p className="mt-6 max-w-md text-base leading-7 text-gray-500 mx-auto">
          Something went wrong on our end. You can try refreshing the page or head back home to continue.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-4">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-[#0F172A] px-8 py-3.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-8 py-3.5 text-sm font-medium text-slate-900 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const pathname = location.pathname.toLowerCase();
  const isAdminPath = pathname.startsWith('/admin');


  return (
    <QueryClientProvider client={queryClient}>
      {!isAdminPath && <Header />}
      <main className={!isAdminPath ? "min-h-screen pb-24" : "min-h-screen"}>
        <Outlet />
      </main>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <FloatingWhatsApp />}
      {!isAdminPath && <BottomNav />}
    </QueryClientProvider>
  );
}
