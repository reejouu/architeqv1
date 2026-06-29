"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCanvasStore } from "@/store/canvasStore";

export default function UserMenu() {
    const router = useRouter();
    const { user, refetch } = useCurrentUser();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null;

    const initial = user.name?.charAt(0).toUpperCase() || "?";

    async function handleLogout() {
        // Leave the live room immediately — otherwise this user's avatar
        // and cursor linger for everyone else still in the room until the
        // websocket eventually times out on its own.
        useCanvasStore.getState().liveblocks.leaveRoom();
        await fetch("/api/auth/logout", { method: "POST" });
        await refetch();
        router.push("/");
    }

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                onClick={() => setOpen((o) => !o)}
                title={user.name}
                style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    border: "2px solid #2c336c",
                    background: "#c78caf",
                    color: "#2c336c",
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "2px 2px 0px 0px #2c336c",
                    flexShrink: 0,
                }}
            >
                {initial}
            </button>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        marginTop: 8,
                        background: "#f3f3f2",
                        border: "2px solid #2c336c",
                        boxShadow: "4px 4px 0px 0px #2c336c",
                        zIndex: 1000,
                        minWidth: 160,
                    }}
                >
                    <div
                        style={{
                            padding: "10px 12px",
                            borderBottom: "1px solid rgba(44,51,108,0.15)",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#2c336c",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {user.name}
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "10px 12px",
                            background: "transparent",
                            border: "none",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#2c336c",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#ddb9ac")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}
