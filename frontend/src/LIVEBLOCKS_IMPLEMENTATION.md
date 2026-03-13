# Real-Time Collaborative Canvas Guide

This guide explains how we made the architecture canvas multiplayer (like Figma or Google Docs) using **Liveblocks**, **Zustand**, and **Next.js NextAuth**.

## Why Liveblocks instead of WebSockets (Socket.io)?
Building a custom WebSocket server from scratch is difficult. If two users move a block at the exact same time, whose move is saved? This is called "conflict resolution".

**Liveblocks handles all the hard parts for us:**
- **WebSockets:** Connecting and disconnecting users automatically.
- **Conflicts (CRDTs):** Merging data perfectly without overriding each other's work.
- **Live Cursors:** Broadcasting where every user's mouse is in real-time.

---

## The 5-Step Architecture

### 1. The Gatekeeper (NextAuth Authentication)
**File:** `src/app/api/liveblocks-auth/route.ts`

**Concept:** We don't want strangers crashing our canvas without permission.
**How it works:**
- When a user tries to join the Canvas, the frontend asks our Next.js API endpoint if they are allowed.
- Our API checks if the user is safely logged in via NextAuth.
- If they are logged in, we grab their Name and give them a random cursor color. 
- We generate a secure Liveblocks "Access Token" permitting them inside the room.

### 2. The Isolated Room (LiveblocksCanvasProvider)
**File:** `src/components/canvas/LiveblocksCanvasProvider.tsx`

**Concept:** If 50 people visit your website, they shouldn't all be thrown onto the same gigantic messy canvas.
**How it works:**
- We wrap our entire Canvas page inside a Liveblocks `<RoomProvider>`.
- When a user visits `/canvas`, we look at the URL for a room code like `?room=abc-123`.
- **If there is no code**, we generate a random 1-of-1 private room using a unique string. This safely isolates them in a brand new workspace, and we attach the code to their URL silently so they don't lose it if they refresh.

### 3. The Shared Brain (Zustand Syncing)
**File:** `src/store/canvasStore.ts`

**Concept:** If User A adds a new Node, User B needs to see it immediately without refreshing.
**How it works:**
- Our React app uses Zustand to remember the `nodes` and `edges` (the shapes and arrows).
- We wrapped our existing Zustand store with the Liveblocks `liveblocks()` middleware.
- We configured it by activating `storageMapping: { nodes: true, edges: true }`.
- **The Magic:** Now, anytime the code says `setNodes(...)`, Zustand updates the local screen *and* invisibly uses the WebSocket to perfectly merge those exact shapes onto every other person's screen in the same room.

### 4. Floating Nametags (Live Cursors)
**File:** `src/components/canvas/canvas/CanvasArea.tsx`

**Concept:** To feel truly collaborative, you need to see exactly where your teammates are pointing.
**How it works:**
- We wrapped our Canvas in an invisible detector that tracks your mouse movements (`e.clientX` / `e.clientY`).
- Every time you move, it broadcasts your X/Y coordinates to Liveblocks via the `updateMyPresence` function.
- Every client then constantly loops over the Liveblocks `useOthers()` hook to paint a floating cursor arrow and Name tag exactly where the other players' mice are hovering in real-time.

### 5. Inviting Friends (The Toolbar)
**File:** `src/components/canvas/toolbar/Toolbar.tsx`

**Concept:** A user needs an interface to hand out the room "keys" to teammates.
**How it works:**
- The top "Share / Join" button powers this workflow:
- **Share:** Simply copies the exact current `room ID` from the user's isolated workspace.
- **Join:** Accepts a custom room code from a friend and forces the browser to load `/canvas?room=CODE`. This triggers a clean refresh, disconnecting from your empty room and immediately plunging you into the shared room database. 
- **Avatars:** We dynamically map the `useOthers` presence data onto small circular Avatar bubbles near the button so you can visually verify exactly who is currently connected.
