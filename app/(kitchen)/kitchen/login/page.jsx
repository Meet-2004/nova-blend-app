"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChefHat } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/ui/Container";

export default function KitchenLogin() {
  const router = useRouter();
  const [staffId, setStaffId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/kitchen/dashboard");
    }, 500);
  };

  return (
    <Container className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="glass-strong rounded-3xl p-8 ring-glow">
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 grid place-items-center">
              <ChefHat className="h-6 w-6 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-1">Kitchen Staff</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Login to receive and prepare orders
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Staff ID</label>
              <input
                type="text"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                placeholder="K001"
                className="w-full glass rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground rounded-2xl py-3 font-semibold mt-6 ring-glow disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Demo: Use any staff ID
          </p>
        </div>
      </motion.div>
    </Container>
  );
}
