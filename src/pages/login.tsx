import AnalyticsLayout from "@/components/AnalyticsLayout";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, ReactElement } from "react";

const Login = () => {
  const router = useRouter();

  const login = useMutation({
    mutationKey: ["login"],
    mutationFn: async (password: string) => {
      const res = await axios.post("/api/auth", { password });
      return res.data;
    },
    onSuccess: () => {
      router.push("/analytics");
    },
  });

  const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = (e.target as any).password.value;
    if (!password || password === "") return;
    login.mutate(password);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form
        className="font-mono relative flex items-center justify-center"
        onSubmit={handlePasswordSubmit}
      >
        <input
          type="password"
          name="password"
          placeholder="Enter the super secret password"
          className={`w-[300px] font-mono rounded-2xl px-5 py-3 outline-none bg-[rgba(255,255,255,0.02)] border ${
            login.isError
              ? "border-[rgba(255,0,0,0.2)] focus:shadow-[0_0_0_3px_rgba(255,0,0,0.1)]"
              : "border-[rgba(255,255,255,0.1)] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)]"
          } [transition:box-shadow_0.3s]`}
        />
        {login.isError ? (
          <span className="text-red-800 absolute -bottom-5 translate-y-full">
            Ah ah, you didn&apos;t say the magic word!
          </span>
        ) : null}
      </form>
    </div>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <AnalyticsLayout>{page}</AnalyticsLayout>;
};

export default Login;
