import CustomerSessionGuard from "@/components/layout/CustomerSessionGuard";

export default function CustomerLayout({ children }) {
  return <CustomerSessionGuard>{children}</CustomerSessionGuard>;
}
