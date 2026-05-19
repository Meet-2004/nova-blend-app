"use client";

import { useSessionGuard } from "@/hooks/useSessionGuard";

export default function CustomerSessionGuard({ children }) {
  useSessionGuard();
  return <>{children}</>;
}
