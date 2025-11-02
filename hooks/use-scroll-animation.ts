"use client";

import { useEffect } from "react";

export function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    // Observe all elements with animation classes
    const animationClasses = [
      ".animate-on-scroll",
      ".animate-slide-left",
      ".animate-slide-right",
      ".animate-zoom",
    ];

    const elements = document.querySelectorAll(animationClasses.join(", "));
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
}
