import { ThemeProvider, useTheme } from "next-themes";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AuthProvider } from "~/components/AuthContext";
import { PageDataProvider } from "~/components/PageDataContext";
import queryClient from "~/utils/queryClient";
import "../styles/globals.css";

function DefaultLayout({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}
function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || DefaultLayout;
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        <PageDataProvider data={pageProps.data}>
          <AuthProvider user={pageProps.user || null}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <ToastWithTheme />
            <ReactQueryDevtools />
          </AuthProvider>
        </PageDataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function ToastWithTheme() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      toastOptions={{
        style:
          resolvedTheme === "dark"
            ? {
                background: "#333",
                color: "#fff",
              }
            : {},
      }}
    />
  );
}

export default MyApp;
