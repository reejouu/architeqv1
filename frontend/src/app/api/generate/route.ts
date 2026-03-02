import { runPipeline } from "@/lib/agents/pipeline";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400 });
        }

        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {
                const onProgress = (message: string) => {
                    const data = JSON.stringify({ type: "progress", message });
                    controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                };

                try {
                    const finalGraph = await runPipeline(prompt, onProgress);
                    const data = JSON.stringify({ type: "result", graph: finalGraph });
                    controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                } catch (error) {
                    console.error("Pipeline error:", error);
                    const errData = JSON.stringify({ type: "error", message: error instanceof Error ? error.message : "Generation failed" });
                    controller.enqueue(encoder.encode(`data: ${errData}\n\n`));
                } finally {
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            }
        });
    } catch (e) {
        console.error("Route error:", e);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
