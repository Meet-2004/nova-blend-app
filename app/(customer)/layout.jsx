"use client";

import { useSessionGuard } from "@/hooks/useSessionGuard";

export default function CustomerLayout({ children }) {
  useSessionGuard();
  return <>{children}</>;
}
