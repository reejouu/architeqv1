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
    custom: {
        label: "Custom",
        color: "#7a7a9e",
        rgb: "122,122,158",
        icon: "plus",
        borderColor: "rgba(122,122,158,0.4)",
        bg: "rgba(122,122,158,0.06)",
    },
    auth: {
        label: "Auth",
        color: "#7b6fa8",
        rgb: "123,111,168",
        icon: "shield",
        borderColor: "rgba(123,111,168,0.3)",
        bg: "rgba(123,111,168,0.06)",
    },
    api: {
        label: "API Gateway",
        color: "#5d7ea8",
        rgb: "93,126,168",
        icon: "zap",
        borderColor: "rgba(93,126,168,0.3)",
        bg: "rgba(93,126,168,0.06)",
    },
    payment: {
        label: "Payment",
        color: "#a87090",
        rgb: "168,112,144",
        icon: "credit-card",
        borderColor: "rgba(168,112,144,0.3)",
        bg: "rgba(168,112,144,0.06)",
    },
    database: {
        label: "Database",
        color: "#5e8f9e",
        rgb: "94,143,158",
        icon: "database",
        borderColor: "rgba(94,143,158,0.3)",
        bg: "rgba(94,143,158,0.06)",
    },
    dashboard: {
        label: "Dashboard",
        color: "#b89550",
        rgb: "184,149,80",
        icon: "layout-dashboard",
        borderColor: "rgba(184,149,80,0.3)",
        bg: "rgba(184,149,80,0.06)",
    },
    notification: {
        label: "Notification",
        color: "#6a9f7c",
        rgb: "106,159,124",
        icon: "bell",
        borderColor: "rgba(106,159,124,0.3)",
        bg: "rgba(106,159,124,0.06)",
    },
    appointment: {
        label: "Appointment",
        color: "#b08840",
        rgb: "176,136,64",
        icon: "calendar",
        borderColor: "rgba(176,136,64,0.3)",
        bg: "rgba(176,136,64,0.06)",
    },
    cache: {
        label: "Cache",
        color: "#c07858",
        rgb: "192,120,88",
        icon: "layers",
        borderColor: "rgba(192,120,88,0.3)",
        bg: "rgba(192,120,88,0.06)",
    },
    queue: {
        label: "Queue",
        color: "#b06878",
        rgb: "176,104,120",
        icon: "list",
        borderColor: "rgba(176,104,120,0.3)",
        bg: "rgba(176,104,120,0.06)",
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
