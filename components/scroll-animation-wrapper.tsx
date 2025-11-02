"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function ScrollAnimationWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useScrollAnimation();

  return <>{children}</>;
}
