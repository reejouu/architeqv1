import { ReactFlowProvider } from "@xyflow/react";
import CanvasPage from "@/components/canvas/CanvasPage";
import LiveblocksCanvasProvider from "@/components/canvas/LiveblocksCanvasProvider";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Canvas — Architeq",
    description: "Build and visualize your system architecture",
};

export default async function CanvasRoute() {
    const session = await auth();
    if (!session?.user) {
        redirect("/");
    }

    return (
        <ReactFlowProvider>
            <LiveblocksCanvasProvider>
                <CanvasPage />
            </LiveblocksCanvasProvider>
        </ReactFlowProvider>
    );
}
