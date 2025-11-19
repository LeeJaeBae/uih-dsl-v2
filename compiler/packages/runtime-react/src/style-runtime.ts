/**
 * UIH Runtime React - Style Runtime
 *
 * React-specific style injection and theming.
 *
 * @module @uih-dsl/runtime-react/style-runtime
 * @version 1.0.0
 */

import { useEffect, useRef, useState } from "react";
import { StyleRuntime } from "@uih-dsl/runtime-core";
import type { StyleToken, StyleTheme } from "@uih-dsl/runtime-core";

// ========================================================================
// React Style Component
// ========================================================================

export interface StyleInjectorProps {
  tokens: StyleToken[];
}

/**
 * React component for injecting style tokens
 *
 * Usage:
 * ```tsx
 * <StyleInjector tokens={[{ path: ["color", "primary"], value: "#0E5EF7" }]} />
 * ```
 */
export function StyleInjector(props: StyleInjectorProps): JSX.Element | null {
  useStyleTokens(props.tokens);
  return null;
}

// ========================================================================
// React Style Hooks
// ========================================================================

/**
 * Hook to inject style tokens on mount
 */
export function useStyleTokens(tokens: StyleToken[]): void {
  const runtime = useStyleRuntime();

  useEffect(() => {
    if (tokens.length > 0) {
      runtime.inject(tokens);
    }

    // Cleanup: remove tokens on unmount
    return () => {
      // Don't clear on unmount as other components might use the same tokens
      // runtime.clear();
    };
  }, [tokens, runtime]);
}

/**
 * Hook to get style runtime instance
 */
export function useStyleRuntime(): StyleRuntime {
  const runtimeRef = useRef<StyleRuntime | null>(null);

  if (!runtimeRef.current) {
    runtimeRef.current = new StyleRuntime();
  }

  return runtimeRef.current;
}

/**
 * Hook to apply theme dynamically (Spec 3.3)
 */
export function useTheme(theme: StyleTheme): void {
  const runtime = useStyleRuntime();

  useEffect(() => {
    runtime.applyTheme(theme);
  }, [theme, runtime]);
}

/**
 * Hook to get CSS variable value
 */
export function useCSSVariable(name: string): string | number | undefined {
  const runtime = useStyleRuntime();
  const [value, setValue] = useState<string | number | undefined>(() =>
    runtime.getVariable(name)
  );

  useEffect(() => {
    // Update value if it changes
    const currentValue = runtime.getVariable(name);
    if (currentValue !== value) {
      setValue(currentValue);
    }
  }, [name, runtime, value]);

  return value;
}

/**
 * Hook to set CSS variable value
 */
export function useSetCSSVariable(): (name: string, value: string | number) => void {
  const runtime = useStyleRuntime();

  return (name: string, value: string | number) => {
    runtime.setVariable(name, value);
  };
}
