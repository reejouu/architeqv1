import { createClient } from "@liveblocks/client";

// ── Liveblocks client (singleton, used by the Zustand middleware) ──
export const liveblocksClient = createClient({
    authEndpoint: "/api/liveblocks-auth",
});

// ── Shared types ──

/** Ephemeral presence — broadcast to all users in a room */
export interface Presence {
    cursor: { x: number; y: number } | null;
}

/** Persisted room storage — CRDT-synced via the Zustand storageMapping */
export interface Storage {
    nodes: any[]; // Node[] from @xyflow/react
    edges: any[]; // Edge[] from @xyflow/react
}

/** User metadata attached to the Liveblocks access token */
export interface UserMeta {
    id: string;
    info: {
        name: string;
        email: string;
        color: string;
    };
}
