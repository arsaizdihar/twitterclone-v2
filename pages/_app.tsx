import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { AuthProvider } from "~/components/AuthContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <AuthProvider user={pageProps.user || null}>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
