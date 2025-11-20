export type TargetFramework = "react" | "vue" | "svelte";

const SUPPORTED_TARGETS: TargetFramework[] = ["react", "vue", "svelte"];

export function normalizeTarget(target?: string): TargetFramework {
  if (!target) return "react";

  const normalized = target.toLowerCase();
  if (SUPPORTED_TARGETS.includes(normalized as TargetFramework)) {
    return normalized as TargetFramework;
  }

  throw new Error(
    `Unsupported target '${target}'. Choose one of: ${SUPPORTED_TARGETS.join(", ")}.`
  );
}
