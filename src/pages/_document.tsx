import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Software developer passionate about innovation and design."
        />
        <meta
          name="keywords"
          content="Stan de La Comble, Stanislas, de La Comble"
        />
      </Head>

      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
