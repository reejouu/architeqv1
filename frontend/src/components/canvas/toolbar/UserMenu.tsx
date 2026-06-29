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
                    border: "1.5px solid var(--ink)",
                    background: "var(--accent)",
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "background 150ms",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#8F4766")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--accent)")}
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
                        background: "var(--white)",
                        border: "2px solid var(--ink)",
                        boxShadow: "4px 4px 0px 0px var(--ink)",
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
                            color: "var(--ink)",
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
                            color: "var(--ink)",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--cream)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}
