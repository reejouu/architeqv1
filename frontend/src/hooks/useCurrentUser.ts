"use client";

import { useCallback, useEffect, useState } from "react";

export interface CurrentUser {
    id: string;
    email: string;
    name: string;
    onboardingComplete: boolean;
}

export function useCurrentUser() {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

    const refetch = useCallback(() => {
        return fetch("/api/auth/me")
            .then((res) => (res.ok ? res.json() : { user: null }))
            .then((data) => {
                setUser(data.user ?? null);
                setStatus(data.user ? "authenticated" : "unauthenticated");
            })
            .catch(() => {
                setStatus("unauthenticated");
            });
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { user, status, refetch };
}
