export const MockNode = ({
    label,
    type,
    color,
    top,
    left,
    status,
    priority,
    scale = 1
}: {
    label: string;
    type: string;
    color: string;
    top: string;
    left: string;
    status?: string;
    priority?: string;
    scale?: number;
}) => {
    return (
        <div
            className="absolute z-10 shadow-[3px_3px_0_0_#2c336c] hover:shadow-[4px_4px_0_0_#2c336c] hover:-translate-y-[calc(50%+2px)] hover:-translate-x-[calc(50%+2px)] transition-all cursor-default"
            style={{
                top,
                left,
                transform: `translate(-50%, -50%) scale(${scale})`,
                transformOrigin: "center center",
                width: 160,
                borderRadius: 14,
                background: "#ffffff",
                border: "2.5px solid #2c336c",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    background: color,
                    borderBottom: "3px solid #2c336c",
                    padding: "8px 10px 8px 12px",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 8,
                }}
            >
                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-inter)', color: '#ffffff', flex: 1, textShadow: "1px 1px 0px rgba(0,0,0,0.25)" }}>
                    {label}
                </span>
                {priority && (
                    <div style={{
                        width: 20,
                        height: 20,
                        borderRadius: 0,
                        background: priority === "1" ? "#EF4444" : priority === "2" ? "#F59E0B" : "#10B981",
                        border: "2px solid #2c336c",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 800,
                        color: "#ffffff",
                        boxShadow: "2px 2px 0px 0px rgba(0,0,0,0.3)",
                        flexShrink: 0
                    }}>
                        P{priority}
                    </div>
                )}
            </div>
            <div
                style={{
                    padding: "6px 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#f3f3f2",
                }}
            >
                <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", background: color, color: '#ffffff', border: "1.5px solid #2c336c", borderRadius: 6, padding: "2px 6px", boxShadow: "2px 2px 0px 0px #2c336c" }}>
                    {type}
                </span>
                {status && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#2c336c", background: "#F59E0B", border: "1.5px solid #2c336c", borderRadius: 6, padding: "2px 6px", boxShadow: "1px 1px 0px 0px #2c336c" }}>
                        {status}
                    </span>
                )}
            </div>
        </div>
    );
};
