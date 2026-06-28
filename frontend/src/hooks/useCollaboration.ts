"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { useCanvasStore } from "@/store/canvasStore";

/**
 * Manages room lifecycle for Liveblocks collaboration.
 *
 * - `startRoom()` — host creates a new room, seeds it with current canvas state
 * - `joinRoom(code)` — navigates to /canvas?room=CODE for a clean join
 * - `leaveRoom()` — exits the room, returns to solo mode
 * - Auto-enters if `?room=` is present in the URL on mount
 */
export function useCollaboration() {
    const [roomId, setRoomId] = useState<string | null>(null);
    const [isHost, setIsHost] = useState(false);
    const hasAutoJoined = useRef(false);

    // Read ?room= from the URL on mount and auto-enter as a joiner
    useEffect(() => {
        if (hasAutoJoined.current) return;
        hasAutoJoined.current = true;

        const params = new URLSearchParams(window.location.search);
        const room = params.get("room");
        if (room) {
            setRoomId(room);
            setIsHost(false);
            useCanvasStore.getState().liveblocks.enterRoom(room);
        }
    }, []);

    /** Host: create a new room seeded with the current canvas */
    const startRoom = useCallback(() => {
        const code = `architeq-${nanoid(10)}`;
        setRoomId(code);
        setIsHost(true);

        // Enter the room — the Liveblocks middleware uses the current store
        // nodes/edges as initial storage since the room is brand new
        useCanvasStore.getState().liveblocks.enterRoom(code);

        // Add ?room= to the URL without a full reload
        const url = new URL(window.location.href);
        url.searchParams.set("room", code);
        window.history.replaceState({}, "", url.toString());
    }, []);

    /** Guest: navigate to /canvas?room=CODE (full page transition for clean state) */
    const joinRoom = useCallback((code: string) => {
        const trimmed = code.trim();
        if (!trimmed) return;
        window.location.href = `/canvas?room=${encodeURIComponent(trimmed)}`;
    }, []);

    /** Leave the current room and return to solo mode */
    const leaveRoom = useCallback(() => {
        useCanvasStore.getState().liveblocks.leaveRoom();
        setRoomId(null);
        setIsHost(false);

        // Strip ?room= from the URL
        const url = new URL(window.location.href);
        url.searchParams.delete("room");
        window.history.replaceState({}, "", url.toString());
    }, []);

    // Derived state from the store
    const others = useCanvasStore((s) => s.liveblocks.others);
    const connectionStatus = useCanvasStore((s) => s.liveblocks.status);
    const isStorageLoading = useCanvasStore((s) => s.liveblocks.isStorageLoading);
    const isInRoom = roomId !== null;

    return {
        roomId,
        isInRoom,
        isHost,
        others,
        connectionStatus,
        isStorageLoading,
        startRoom,
        joinRoom,
        leaveRoom,
    };
}
