export const SERVING_MODES = {
  DINE_IN: "dine-in",
  TAKEAWAY: "takeaway",
};

export const SESSION_STATUS = {
  IDLE: "idle",
  ACTIVE: "active",
  COMPLETED: "completed",
};

export const BILL_STATUS = {
  NONE: "none",
  GENERATED: "generated",
  PAID: "paid",
};

export const TAKEAWAY_STATUSES = [
  { id: "received", label: "Order received", desc: "Your order is confirmed." },
  { id: "preparing", label: "Preparing", desc: "Kitchen is working on it." },
  { id: "ready", label: "Ready for pickup", desc: "Head to the counter!" },
  { id: "completed", label: "Completed", desc: "Enjoy your meal!" },
];

export const DINE_IN_STAGES = [
  { id: "placed", label: "Order placed" },
  { id: "kitchen", label: "In the kitchen" },
  { id: "cooking", label: "Cooking" },
  { id: "serving", label: "Being served" },
  { id: "served", label: "Served" },
];

export const ORDER_STATUS = {
  NONE: "none",
  PLACED: "placed",
  KITCHEN: "kitchen",
  COOKING: "cooking",
  SERVING: "serving",
  SERVED: "served",
};

export const OTP_LENGTH = 4;
export const OTP_RESEND_COOLDOWN = 30;
export const DEMO_OTP = "1234";
export const MOBILE_BREAKPOINT = 768;
