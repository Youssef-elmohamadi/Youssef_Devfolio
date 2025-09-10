"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type ProtectedProviderProps = {
  children: React.ReactNode;
};

export default function ProtectedProvider({
  children,
}: ProtectedProviderProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  return <>{children}</>;
}
