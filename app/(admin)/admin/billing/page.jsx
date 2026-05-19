"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useSelector } from "react-redux";
import { selectAllOrders } from "@/store/slices/ordersSlice";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function AdminBillingPage() {
  const orders = useSelector(selectAllOrders);

  const pendingBills = orders.filter((o) => o.status !== "completed");
  const completedBills = orders.filter((o) => o.status === "completed");

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingAmount = pendingBills.reduce((sum, o) => sum + o.totalAmount, 0);

  const BillSection = ({ title, bills, variant = "pending" }) => (
    <div className="mt-8">
      <h2 className="text-sm font-semibold mb-3 px-1">{title}</h2>
      {bills.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">No bills</p>
      ) : (
        <div className="space-y-2">
          {bills.map((bill) => (
            <motion.div
              key={bill.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "glass rounded-2xl p-3 flex items-center justify-between",
                variant === "completed" && "opacity-60"
              )}
            >
              <div>
                <p className="font-semibold text-sm">Table {bill.tableNumber}</p>
                <p className="text-xs text-muted-foreground">{bill.id}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{formatPrice(bill.totalAmount)}</p>
                <p className="text-xs text-muted-foreground">{bill.groups.length} group(s)</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Billing" subtitle="Invoice management" backTo="/admin/dashboard" />

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-4"
        >
          <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-strong rounded-2xl p-4"
        >
          <p className="text-xs text-muted-foreground mb-1">Pending Bills</p>
          <p className="text-2xl font-bold">{formatPrice(pendingAmount)}</p>
        </motion.div>
      </div>

      <BillSection title="Pending Bills" bills={pendingBills} variant="pending" />
      <BillSection title="Completed Bills" bills={completedBills} variant="completed" />
    </Container>
  );
}
