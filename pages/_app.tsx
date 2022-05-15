import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AuthProvider } from "~/components/AuthContext";
import queryClient from "~/utils/queryClient";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        <AuthProvider user={pageProps.user || null}>
          <Component {...pageProps} />
          <ReactQueryDevtools />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
