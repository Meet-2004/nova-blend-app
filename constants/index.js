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

export const BATCH_STATUS = {
  RECEIVED: "received",
  PREPARING: "preparing",
  COOKING: "cooking",
  SERVING: "serving",
  SERVED: "served",
  SCHEDULED: "scheduled",
};

export const BATCH_STATUS_ORDER = [
  BATCH_STATUS.SCHEDULED,
  BATCH_STATUS.RECEIVED,
  BATCH_STATUS.PREPARING,
  BATCH_STATUS.COOKING,
  BATCH_STATUS.SERVING,
  BATCH_STATUS.SERVED,
];

export const BATCH_STATUS_LABELS = {
  [BATCH_STATUS.SCHEDULED]: "Scheduled",
  [BATCH_STATUS.RECEIVED]: "Order received",
  [BATCH_STATUS.PREPARING]: "Preparing",
  [BATCH_STATUS.COOKING]: "Cooking",
  [BATCH_STATUS.SERVING]: "Being served",
  [BATCH_STATUS.SERVED]: "Served",
};

export const BATCH_STATUS_DESC = {
  [BATCH_STATUS.SCHEDULED]: "Will start at the scheduled time.",
  [BATCH_STATUS.RECEIVED]: "Your order is confirmed.",
  [BATCH_STATUS.PREPARING]: "Kitchen is working on it.",
  [BATCH_STATUS.COOKING]: "Your food is being cooked.",
  [BATCH_STATUS.SERVING]: "On its way to your table!",
  [BATCH_STATUS.SERVED]: "All items at your table.",
};

export const SERVING_TIME_OPTIONS = [
  { id: "now", label: "Serve now", delay: 0 },
  { id: "10min", label: "After 10 min", delay: 10 },
  { id: "20min", label: "After 20 min", delay: 20 },
  { id: "30min", label: "After 30 min", delay: 30 },
  { id: "45min", label: "After 45 min", delay: 45 },
];

export const TAKEAWAY_STATUSES = [
  { id: "received", label: "Order received", desc: "Your order is confirmed." },
  { id: "preparing", label: "Preparing", desc: "Kitchen is working on it." },
  { id: "ready", label: "Ready for pickup", desc: "Head to the counter!" },
  { id: "completed", label: "Completed", desc: "Enjoy your meal!" },
];

export const OTP_LENGTH = 4;
export const OTP_RESEND_COOLDOWN = 30;
export const DEMO_OTP = "1234";
export const MOBILE_BREAKPOINT = 768;
