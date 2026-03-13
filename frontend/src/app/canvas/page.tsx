import { ReactFlowProvider } from "@xyflow/react";
import CanvasPage from "@/components/canvas/CanvasPage";

export const metadata = {
    title: "Canvas — Architeq",
    description: "Build and visualize your system architecture",
};

export default async function CanvasRoute() {
    return (
        <ReactFlowProvider>
            <CanvasPage />
        </ReactFlowProvider>
    );
}
