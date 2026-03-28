"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering a skeleton or null during SSR
  if (!isMounted) return null;

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div>
          <span className="text-surface-400">Loading experience...</span>
        </div>
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
