import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { ReactElement, useEffect } from "react";

const AnalyticsLayout = ({ children }: { children: ReactElement }) => {
  const router = useRouter();

  const isAuthorized = useQuery({
    queryKey: ["checkAuth"],
    queryFn: async () => {
      const res = await axios.get("/api/checkAuth");
      return res.data;
    },
  });

  useEffect(() => {
    if (isAuthorized.isError) {
      router.push("/login");
    }
  }, [isAuthorized.isError, router]);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      {children}
    </>
  );
};

export default AnalyticsLayout;
