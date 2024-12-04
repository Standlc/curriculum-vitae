import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { Playfair_Display, Inter } from "next/font/google";
import Head from "next/head";
import { ReactElement, ReactNode } from "react";

const Playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    },
  },
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Stan de La Comble</title>
        <meta
          name="description"
          content="Software developer passionate about innovation and design."
        />
        <meta
          name="keywords"
          content="Stan de La Comble, Stanislas, de La Comble"
        />
      </Head>
      {getLayout(
        <main className={`${Playfair.variable} ${inter.variable} font-serif`}>
          <Component {...pageProps} />
        </main>
      )}
    </QueryClientProvider>
  );
}
