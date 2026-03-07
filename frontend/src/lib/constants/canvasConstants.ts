// Node type definitions, colors, and icons mapping

export const COLOR_PALETTE = [
  // Neutral
  "#f3f3f2", // Off-white

  // Architeq Subtle Graph Theme
  "#7b6fa8", // Core (Muted Purple)
  "#5e8f9e", // Integration (Muted Teal)
  "#6a9f7c", // Service (Muted Green)
  "#5d7ea8", // Database (Muted Blue)
  "#b89550", // Frontend (Muted Gold)
  "#a87090", // Queue (Muted Rose)
  "#c07858", // Cache (Muted Rust)
  "#b06878", // Infra (Muted Red)
  "#b08840", // Input (Muted Bronze)
];
export const NODE_TYPES_CONFIG = {
    auth: {
        label: "Auth",
        color: "#8B5CF6",
        rgb: "139,92,246",
        icon: "shield",
        borderColor: "rgba(139,92,246,0.3)",
        bg: "rgba(139,92,246,0.06)",
    },
    api: {
        label: "API Gateway",
        color: "#3B82F6",
        rgb: "59,130,246",
        icon: "zap",
        borderColor: "rgba(59,130,246,0.3)",
        bg: "rgba(59,130,246,0.06)",
    },
    payment: {
        label: "Payment",
        color: "#D946EF",
        rgb: "217,70,239",
        icon: "credit-card",
        borderColor: "rgba(217,70,239,0.3)",
        bg: "rgba(217,70,239,0.06)",
    },
    database: {
        label: "Database",
        color: "#22D3EE",
        rgb: "34,211,238",
        icon: "database",
        borderColor: "rgba(34,211,238,0.3)",
        bg: "rgba(34,211,238,0.06)",
    },
    dashboard: {
        label: "Dashboard",
        color: "#F59E0B",
        rgb: "245,158,11",
        icon: "layout-dashboard",
        borderColor: "rgba(245,158,11,0.3)",
        bg: "rgba(245,158,11,0.06)",
    },
    notification: {
        label: "Notification",
        color: "#10B981",
        rgb: "16,185,129",
        icon: "bell",
        borderColor: "rgba(16,185,129,0.3)",
        bg: "rgba(16,185,129,0.06)",
    },
    appointment: {
        label: "Appointment",
        color: "#F97316",
        rgb: "249,115,22",
        icon: "calendar",
        borderColor: "rgba(249,115,22,0.3)",
        bg: "rgba(249,115,22,0.06)",
    },
    cache: {
        label: "Cache",
        color: "#6366F1",
        rgb: "99,102,241",
        icon: "layers",
        borderColor: "rgba(99,102,241,0.3)",
        bg: "rgba(99,102,241,0.06)",
    },
    queue: {
        label: "Queue",
        color: "#EC4899",
        rgb: "236,72,153",
        icon: "list",
        borderColor: "rgba(236,72,153,0.3)",
        bg: "rgba(236,72,153,0.06)",
    },
} as const;

export type NodeType = keyof typeof NODE_TYPES_CONFIG;

export const SAMPLE_NODES = [
    { id: "1", type: "archNode", position: { x: 100, y: 180 }, data: { type: "auth", label: "Auth Service", owner: "PK" } },
    { id: "2", type: "archNode", position: { x: 350, y: 100 }, data: { type: "api", label: "API Gateway", owner: "MR" } },
    { id: "3", type: "archNode", position: { x: 600, y: 180 }, data: { type: "payment", label: "Payment", owner: "SK" } },
    { id: "4", type: "archNode", position: { x: 600, y: 340 }, data: { type: "database", label: "User DB", owner: "PK" } },
    { id: "5", type: "archNode", position: { x: 350, y: 340 }, data: { type: "notification", label: "Notifications", owner: "MR" } },
];

export const SAMPLE_EDGES = [
    { id: "e1-2", source: "1", target: "2", type: "archEdge" },
    { id: "e2-3", source: "2", target: "3", type: "archEdge" },
    { id: "e2-4", source: "2", target: "4", type: "dependencyEdge" },
    { id: "e2-5", source: "2", target: "5", type: "archEdge" },
];

export const COLLABORATORS = [
    { initials: "PK", name: "Priya Kumar", color: "#8B5CF6" },
    { initials: "MR", name: "Marcus Reid", color: "#22D3EE" },
    { initials: "SK", name: "Sara Kim", color: "#D946EF" },
    { initials: "JD", name: "James Doe", color: "#F59E0B" },
];
