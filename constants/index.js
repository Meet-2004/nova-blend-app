export const SERVING_MODES = {
  DINE_IN: "dine-in",
  TAKEAWAY: "takeaway",
};

export const SESSION_STATUS = {
  IDLE: "idle",
  ACTIVE: "active",
};

export const BILL_STATUS = {
  NONE: "none",
  GENERATED: "generated",
  PAID: "paid",
};

// The lifecycle of a single order group
export const GROUP_STATUS = {
  SCHEDULED: "scheduled",  // delayed order, not yet started
  RECEIVED: "received",    // kitchen received it
  PREPARING: "preparing",  // kitchen is working on it
  COOKING: "cooking",      // actively cooking
  SERVED: "served",        // delivered to table
};

// Progress order (excluding SCHEDULED since it's a holding state)
export const GROUP_STATUS_ACTIVE_ORDER = [
  GROUP_STATUS.RECEIVED,
  GROUP_STATUS.PREPARING,
  GROUP_STATUS.COOKING,
  GROUP_STATUS.SERVED,
];

export const GROUP_STATUS_LABELS = {
  [GROUP_STATUS.SCHEDULED]: "Scheduled",
  [GROUP_STATUS.RECEIVED]: "Received",
  [GROUP_STATUS.PREPARING]: "Preparing",
  [GROUP_STATUS.COOKING]: "Cooking",
  [GROUP_STATUS.SERVED]: "Served",
};

export const GROUP_STATUS_DESC = {
  [GROUP_STATUS.SCHEDULED]: "Will start at the scheduled time.",
  [GROUP_STATUS.RECEIVED]: "Your order is confirmed.",
  [GROUP_STATUS.PREPARING]: "Kitchen is working on it.",
  [GROUP_STATUS.COOKING]: "Your food is being cooked.",
  [GROUP_STATUS.SERVED]: "All items at your table. Enjoy!",
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

// Legacy aliases so existing code doesn't break during refactor
export const BATCH_STATUS = GROUP_STATUS;
export const BATCH_STATUS_ORDER = GROUP_STATUS_ACTIVE_ORDER;
export const BATCH_STATUS_LABELS = GROUP_STATUS_LABELS;
export const BATCH_STATUS_DESC = GROUP_STATUS_DESC;

export const OTP_LENGTH = 4;
export const OTP_RESEND_COOLDOWN = 30;
export const DEMO_OTP = "1234";
export const MOBILE_BREAKPOINT = 768;
