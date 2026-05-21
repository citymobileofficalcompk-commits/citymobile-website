import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "City Mobile — Premium Mobiles & Accessories Store in Pakistan" },
      { name: "description", content: "Pakistan's trusted store for original PTA-approved smartphones, premium accessories and certified mobile repair. Multan & DG Khan." },
      { name: "author", content: "City Mobile" },
      { property: "og:title", content: "City Mobile — Premium Mobile Store" },
      { property: "og:description", content: "Original PTA-approved mobiles, premium accessories & certified repair services." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const pathname = location.pathname;
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
