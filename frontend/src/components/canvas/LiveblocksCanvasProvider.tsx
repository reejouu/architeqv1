"use client";

import { LiveblocksProvider, RoomProvider } from "@liveblocks/react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GlobalLoader from "@/components/canvas/loaders/GlobalLoader";
import { useCanvasStore } from "@/store/canvasStore";
import { v4 as uuidv4 } from "uuid";

export default function LiveblocksCanvasProvider({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [roomId] = useState(() => {
        const urlRoom = searchParams.get("room");
        if (urlRoom) return urlRoom;
        
        // Generate isolated room id to prevent overlapping default rooms
        return `room_${uuidv4()}`;
    });

    useEffect(() => {
        // Silently update URL so reloading saves the specific session
        if (!searchParams.get("room")) {
            router.replace(`?room=${roomId}`, { scroll: false });
        }
    }, [roomId, router, searchParams]);

    const enterRoom = useCanvasStore((state) => state.liveblocks.enterRoom);
    const leaveRoom = useCanvasStore((state) => state.liveblocks.leaveRoom);

    useEffect(() => {
        enterRoom(roomId);
        return () => {
            leaveRoom();
        };
    }, [roomId, enterRoom, leaveRoom]);

    return (
        <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
            <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
                <LiveblocksSuspenseFallback>
                    {children}
                </LiveblocksSuspenseFallback>
            </RoomProvider>
        </LiveblocksProvider>
    );
}

function LiveblocksSuspenseFallback({ children }: { children: React.ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Optionally use ClientSideSuspense from `@liveblocks/react` here if we want to wait for Room connection.
    // However, Zustand middleware starts syncing automatically, and we want users to view the Canvas immediately.
    return isMounted ? children : <GlobalLoader />;
}
