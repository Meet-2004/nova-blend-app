"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, CreditCard as Edit2, Eye, EyeOff } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { selectAllMenuItems, toggleItemAvailability } from "@/store/slices/menuSlice";
import { formatPrice } from "@/lib/format";

export default function AdminMenuPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const items = useSelector(selectAllMenuItems);

  const categories = ["starters", "mains", "breads", "desserts", "drinks"];

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Menu" subtitle="Manage menu items" backTo="/admin/dashboard" />

      {/* Add item button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 w-full glass rounded-2xl p-4 flex items-center justify-center gap-2 hover:bg-white/10 transition"
      >
        <Plus className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">Add new item</span>
      </motion.button>

      {/* Items by category */}
      {categories.map((category) => {
        const categoryItems = items.filter((i) => i.category === category);
        if (categoryItems.length === 0) return null;

        return (
          <div key={category} className="mt-8">
            <h2 className="text-sm font-semibold mb-3 capitalize px-1">
              {category === "starters" ? "Starters" : category === "mains" ? "Main Course" : category}
            </h2>

            <div className="space-y-2">
              {categoryItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`glass rounded-2xl p-3 flex items-center gap-3 ${!item.available ? "opacity-50" : ""}`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dispatch(toggleItemAvailability(item.id))}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 hover:bg-white/10 transition"
                    >
                      {item.available ? (
                        <Eye className="h-4 w-4 text-primary" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    <button className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 hover:bg-white/10 transition">
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </Container>
  );
}
