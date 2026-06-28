# Real-Time Collaborative Canvas (Liveblocks) — Design Spec

**Date:** 2026-06-29
**Status:** Approved (design)
**Author:** brainstormed with Claude

## Goal

Add opt-in, real-time multiplayer collaboration to the architeq canvas:

- A user can **create a room** and share a code/link.
- Others can **join** the room and edit the **same canvas live** (nodes & edges merge across users via CRDTs).
- Each participant's **cursor is visible with their name**, in their own color (Figma/Excalidraw style).

This is layered on the **existing** architecture without disrupting solo editing.

## Current architecture (constraints this design must respect)

- **Next.js 15 App Router + React 19** (`frontend/`). Not Vite.
- **Custom JWT auth**, NOT NextAuth: `jose`-signed httpOnly `session` cookie, `getSession()` server helper (`src/lib/auth/session.ts`, `src/lib/auth/jwt.ts`), `middleware.ts` guards `/canvas`. User identity (`name`, `email`) is available via Prisma (`src/app/api/auth/me/route.ts`).
- **Canvas = React Flow (`@xyflow/react`)**. `CanvasArea.tsx` keeps React Flow's own local state (`useNodesState`/`useEdgesState`) and syncs it from the Zustand store via effects. The **Zustand store (`src/store/canvasStore.ts`) is the source of truth.**
- **Persistence = Prisma / Aurora Postgres** via versioned saves: `/api/projects/[id]/save`, `/load`, `/restore`, `/versions`. One project per user; `projectId` lives in the store.
- `LIVEBLOCKS_SECRET_KEY` already present in `.env.local`.

## Decisions (locked during brainstorming)

1. **Room model:** Opt-in shared rooms. Solo editing is unchanged (DB load/save). A "Collaborate/Share" button starts a Liveblocks room; others join via `?room=CODE`.
2. **Persistence:** Host's project saves the result. The room is seeded from the host's project; only the host (owner of `projectId`) persists back via the existing save flow. Guests edit live but do not own the save.
3. **Sync scope:** Nodes/edges (shared CRDT state) + named cursors. Selection, panels, undo/redo stay local.
4. **Connection owner:** The **Zustand store** via `@liveblocks/zustand` middleware (single connection). No React `RoomProvider` — matches the prior project and avoids a double connection.

## Architecture

Collaboration is a mode layered over the existing solo flow. The store gains a Liveblocks middleware wrapper. While **not** in a room, the store behaves exactly as today (purely local `nodes`/`edges`). When the user enters a room, `nodes`/`edges` become CRDT-synced storage and `cursor` becomes broadcast presence. Leaving the room restores solo behavior.

```
Solo:    Zustand store  <->  React Flow (useNodesState)  <->  Postgres (save/load)
In room: Liveblocks Storage  <->  Zustand store  <->  React Flow
         Liveblocks Presence (cursor) -> other clients' overlay
```

## Components & changes

### New files

1. **`src/app/api/liveblocks-auth/route.ts`** — the gatekeeper, adapted to the project's JWT auth.
   - Reads `getSession()`; 401 if absent.
   - Loads the user via Prisma for `name`/`email`.
   - Uses `@liveblocks/node` `Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY })` to issue an access token for the requested room, with `userInfo: { name, email, color }` (random per-session color from a fixed palette).
   - Returns the token body/status to the client.

2. **`src/lib/liveblocks/client.ts`** — `createClient({ authEndpoint: "/api/liveblocks-auth" })`. Declares shared types:
   - `Presence`: `{ cursor: { x: number; y: number } | null }` (cursor stored in **flow coordinates**).
   - `Storage`: `{ nodes: Node[]; edges: Edge[] }`.
   - `UserMeta`: `{ info: { name: string; email: string; color: string } }`.

3. **`src/hooks/useCollaboration.ts`** — collaboration controller:
   - Generates room ids (`architeq-<nanoid>`).
   - Reads `?room=` from the URL on mount and auto-enters if present.
   - Wraps `enterRoom`/`leaveRoom` from the store's `liveblocks` API.
   - Exposes connection status, current room id, `others`, and `isHost`. **`isHost` is determined by entry path, not project ownership:** the user who started the room via the Collaborate button is host; a user who arrived via `?room=CODE` is a joiner. Tracked with a flag set at `enterRoom` time. A joiner must **skip** the `/api/projects/me` DB hydrate/seed in `CanvasPage` so they don't overwrite room storage with their own project.

### Modified files

4. **`src/store/canvasStore.ts`**
   - Wrap the existing `create((set, get) => ({...}))` body in `liveblocks(config, { client, storageMapping: { nodes: true, edges: true }, presenceMapping: { cursor: true } })`.
   - Add `cursor: { x, y } | null` state and `setCursor(pos)` action.
   - **Do not map** `history`, `selectedNodeId(s)`, `selectedEdgeIds`, `saveStatus`, `projectId`, `projectName`, panels, AI flags — they stay local, so solo logic and undo/redo are unchanged.
   - The middleware exposes `state.liveblocks` (`enterRoom`, `leaveRoom`, `room`, `others`, `connection`, `isStorageLoading`).

5. **`src/components/canvas/toolbar/Toolbar.tsx`**
   - **Collaborate/Share** control:
     - Start: generate code, `enterRoom(code)`, write `?room=CODE` to the URL (without full reload), show the code with copy-to-clipboard.
     - Join: input that navigates to `/canvas?room=CODE`.
     - Leave: `leaveRoom()` and strip `?room` from the URL.
   - **Avatars:** map `state.liveblocks.others` to colored avatar bubbles (initials from `info.name`), plus a connection indicator.

6. **`src/components/canvas/canvas/CanvasArea.tsx`**
   - On `onPointerMove`, convert `clientX/Y` to flow coordinates via `screenToFlowPosition` and `setCursor(...)`; on `onPointerLeave`, `setCursor(null)`.
   - Render an overlay of other users' cursors from `state.liveblocks.others`: an arrow + name pill in `info.color`, positioned by converting each cursor's flow coordinates back to screen space (via React Flow's viewport transform) so cursors track pan/zoom.

### Dependencies

Add: `@liveblocks/client`, `@liveblocks/zustand`, `@liveblocks/node`, and a small id generator (`nanoid`). Installed via pnpm (the repo uses pnpm workspaces).

## Data flow & persistence

- **Solo (no room):** store ↔ React Flow ↔ Postgres, unchanged.
- **Host starts a room:** current DB-loaded canvas seeds the empty room storage (seed only when storage is empty). URL gains `?room=CODE`.
- **Guest joins (`?room=CODE`):** store enters the room; room storage replaces local `nodes`/`edges`; guest edits live.
- **Saving:** only the host (owner of `projectId`) persists via the existing Save flow. Guests have no `projectId`, so their Save is disabled in-room. No schema/API changes.
- **Cursors:** `cursor` presence-mapped → broadcast on pointer move → others rendered from `liveblocks.others`. Name/color come from the auth token's `userInfo`.

## Risks & mitigations

- **Three sync layers** (Liveblocks → store → React Flow's `useNodesState`). Keep the store as the single source of truth; existing store→RF effects propagate remote CRDT updates unchanged.
- **Seeding race** (host vs storage). Seed only when room storage is empty; otherwise local is replaced by storage.
- **Cursor coordinate space.** Store cursors in flow coordinates and convert back to screen for rendering, so cursors stay aligned under pan/zoom (not raw `clientX/Y` like the simpler prior guide).
- **Undo/redo while collaborating.** History is local and unmapped; undo mutates local `nodes`/`edges`, which the middleware then syncs. Acceptable for v1 (no shared/multiplayer undo).

## Testing

- **Two-browser manual check:** create room in browser A, join in B with the code. Verify: node add/move/delete merges both directions; cursors render with correct names/colors and track pan/zoom; host Save persists to the project; guest Leave is clean and returns to solo.
- **Solo regression:** with no active room, load/save/undo/redo/version-restore behave exactly as before.
- **Build:** `next build` passes; no type errors in the wrapped store.

## Out of scope (YAGNI)

Shared selection/highlights, follow-mode, comments/chat, presence-aware locking, guest "save as new project," and multiplayer undo. All addable later without reworking this foundation.
