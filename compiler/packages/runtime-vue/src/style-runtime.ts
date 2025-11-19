/**
 * UIH Runtime Vue - Style Runtime
 *
 * Vue-specific style injection and theming.
 *
 * @module @uih-dsl/runtime-vue/style-runtime
 * @version 1.0.0
 */

import { onMounted, ref, watch } from "vue";
import { StyleRuntime } from "@uih-dsl/runtime-core";
import type { StyleToken, StyleTheme } from "@uih-dsl/runtime-core";
import type { Ref, Directive } from "vue";

// ========================================================================
// Vue Style Composables
// ========================================================================

// Singleton instance for style runtime
let vueRuntimeInstance: StyleRuntime | null = null;

/**
 * Composable to inject style tokens on mount
 */
export function useStyleTokens(tokens: StyleToken[]): void {
  const runtime = useStyleRuntime();

  onMounted(() => {
    if (tokens.length > 0) {
      runtime.inject(tokens);
    }
  });

  // Note: Don't clear on unmount as other components might use the same tokens
}

/**
 * Composable to get style runtime instance
 */
export function useStyleRuntime(): StyleRuntime {
  if (!vueRuntimeInstance) {
    vueRuntimeInstance = new StyleRuntime();
  }
  return vueRuntimeInstance;
}

/**
 * Composable to apply theme dynamically (Spec 3.3)
 */
export function useTheme(theme: StyleTheme): void {
  const runtime = useStyleRuntime();

  onMounted(() => {
    runtime.applyTheme(theme);
  });

  // Watch theme changes
  watch(
    () => theme,
    (newTheme) => {
      runtime.applyTheme(newTheme);
    },
    { deep: true }
  );
}

/**
 * Composable to get CSS variable value (reactive)
 */
export function useCSSVariable(name: string): Ref<string | number | undefined> {
  const runtime = useStyleRuntime();
  const value = ref<string | number | undefined>(runtime.getVariable(name));

  // Watch for changes
  watch(
    () => runtime.getVariable(name),
    (newValue) => {
      value.value = newValue;
    }
  );

  return value;
}

/**
 * Composable to set CSS variable value
 */
export function useSetCSSVariable(): (name: string, value: string | number) => void {
  const runtime = useStyleRuntime();

  return (name: string, value: string | number) => {
    runtime.setVariable(name, value);
  };
}

// ========================================================================
// Vue Style Directive
// ========================================================================

/**
 * Vue directive for injecting style tokens
 *
 * Usage:
 * ```vue
 * <div v-uih-style="tokens">
 * ```
 */
export const vUihStyle: Directive<HTMLElement, StyleToken[]> = {
  mounted(el, binding) {
    const tokens = binding.value;
    if (tokens && tokens.length > 0) {
      const runtime = vueRuntimeInstance || new StyleRuntime();
      runtime.inject(tokens);

      if (!vueRuntimeInstance) {
        vueRuntimeInstance = runtime;
      }
    }
  },

  updated(el, binding) {
    const tokens = binding.value;
    if (tokens && tokens.length > 0) {
      const runtime = vueRuntimeInstance || new StyleRuntime();
      runtime.inject(tokens);
    }
  },
};
