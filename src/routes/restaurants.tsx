import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

// Legacy alias — redirect to takeaway flow.
export const Route = createFileRoute("/restaurants")({ component: Redirect });

function Redirect() {
  const nav = useNavigate();
  useEffect(() => {
    nav({ to: "/takeaway-login", replace: true });
  }, [nav]);
  return null;
}
