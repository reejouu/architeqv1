import { useCanvasStore } from "./store/canvasStore";

const { loadGraph } = useCanvasStore.getState();

loadGraph({
  nodes: [
    { id: "auth",    label: "User Auth",      type: "core",        owner: "Frontend", status: "In Progress" },
    { id: "api",     label: "API Gateway",    type: "integration", owner: "Backend",  status: "Not Started" },
    { id: "db",      label: "Postgres DB",    type: "database",    owner: "Backend",  status: "Done"        },
  ],
  edges: [
    { from: "auth", to: "api" },
    { from: "api",  to: "db"  },
  ]
});
