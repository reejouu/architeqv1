"use client";

import { useEffect } from "react";

export function useScrollReveal() {
    useEffect(() => {
        // Small delay to ensure all child components have rendered
        const timeout = setTimeout(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("revealed");
                        }
                    });
                },
                { threshold: 0.1 }
            );

            document.querySelectorAll(".reveal").forEach((el) => {
                observer.observe(el);
            });

            return () => observer.disconnect();
        }, 100);

        return () => clearTimeout(timeout);
    }, []);
}
