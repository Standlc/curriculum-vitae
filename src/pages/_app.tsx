import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Playfair_Display, Inter } from "next/font/google";

const Playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${Playfair.variable} ${inter.variable} font-serif`}>
      <Component {...pageProps} />
    </main>
  );
}
