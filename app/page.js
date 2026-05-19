import CustomerSessionGuard from "@/components/layout/CustomerSessionGuard";
import CustomerLanding from "@/components/pages/CustomerLanding";

export default function Home() {
  return (
    <CustomerSessionGuard>
      <CustomerLanding />
    </CustomerSessionGuard>
  );
}
