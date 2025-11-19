/**
 * UIH Runtime Core - Event Mapping
 *
 * Event name normalization and handler mapping following Runtime Specification v1.0 Section 2
 *
 * @module @uih-dsl/runtime-core/event-mapping
 * @version 1.0.0
 */

// ========================================================================
// Event Mapping Types
// ========================================================================

export type EventHandlerFunction = (...args: any[]) => void | Promise<void>;

export interface EventMapping {
  /**
   * DSL event name (e.g., "onclick")
   */
  dslEvent: string;

  /**
   * Framework-specific event name (e.g., "onClick" for React)
   */
  frameworkEvent: string;

  /**
   * Handler function name (e.g., "handleClick")
   */
  handlerName: string;
}

// ========================================================================
// Event Name Normalization (Spec 2.2.3)
// ========================================================================

/**
 * Event name mapping table from Spec 2.2.3
 */
export const EVENT_NAME_MAP = {
  onclick: { react: "onClick", vue: "@click", svelte: "on:click" },
  onload: { react: "useEffect", vue: "onMounted", svelte: "onMount" },
  onsubmit: { react: "onSubmit", vue: "@submit", svelte: "on:submit" },
  onchange: { react: "onChange", vue: "@change", svelte: "on:change" },
  oninput: { react: "onInput", vue: "@input", svelte: "on:input" },
  onblur: { react: "onBlur", vue: "@blur", svelte: "on:blur" },
  onfocus: { react: "onFocus", vue: "@focus", svelte: "on:focus" },
  onkeydown: { react: "onKeyDown", vue: "@keydown", svelte: "on:keydown" },
  onkeyup: { react: "onKeyUp", vue: "@keyup", svelte: "on:keyup" },
  onmouseenter: { react: "onMouseEnter", vue: "@mouseenter", svelte: "on:mouseenter" },
  onmouseleave: { react: "onMouseLeave", vue: "@mouseleave", svelte: "on:mouseleave" },
} as const;

export type DSLEventName = keyof typeof EVENT_NAME_MAP;
export type FrameworkName = "react" | "vue" | "svelte";

// ========================================================================
// Event Mapper Class
// ========================================================================

/**
 * Event name mapper for framework-specific conversion
 */
export class EventMapper {
  private framework: FrameworkName;

  constructor(framework: FrameworkName) {
    this.framework = framework;
  }

  /**
   * Normalize DSL event name to framework-specific event name
   */
  normalize(dslEvent: string): string {
    const mapping = EVENT_NAME_MAP[dslEvent as DSLEventName];

    if (!mapping) {
      // Unknown event: return as-is or convert camelCase for React
      if (this.framework === "react") {
        // Convert onclick → onClick
        return dslEvent.replace(/^on/, "on").replace(/^on(.)/, (_, c) => "on" + c.toUpperCase());
      }
      return dslEvent;
    }

    return mapping[this.framework];
  }

  /**
   * Check if event is supported
   */
  isSupported(dslEvent: string): boolean {
    return dslEvent in EVENT_NAME_MAP;
  }

  /**
   * Get all supported DSL event names
   */
  getSupportedEvents(): string[] {
    return Object.keys(EVENT_NAME_MAP).sort();
  }
}

// ========================================================================
// Event Handler Registry
// ========================================================================

/**
 * Runtime registry for event handlers
 */
export class EventHandlerRegistry {
  private handlers: Map<string, EventHandlerFunction>;

  constructor() {
    this.handlers = new Map();
  }

  /**
   * Register an event handler
   */
  register(name: string, handler: EventHandlerFunction): void {
    if (this.handlers.has(name)) {
      console.warn(`[UIH] Overriding event handler: ${name}`);
    }
    this.handlers.set(name, handler);
  }

  /**
   * Get an event handler by name
   */
  get(name: string): EventHandlerFunction | undefined {
    return this.handlers.get(name);
  }

  /**
   * Execute an event handler with error handling (Spec 8.2)
   */
  execute(name: string, ...args: any[]): void | Promise<void> {
    const handler = this.handlers.get(name);

    if (!handler) {
      console.error(`[UIH] Event handler not found: ${name}`);
      return;
    }

    try {
      const result = handler(...args);

      // Handle async handlers
      if (result instanceof Promise) {
        return result.catch((error) => {
          console.error(`[UIH] Async event handler error in "${name}":`, error);
          throw error;
        });
      }

      return result;
    } catch (error) {
      console.error(`[UIH] Event handler error in "${name}":`, error);
      throw error;
    }
  }

  /**
   * Check if handler exists
   */
  has(name: string): boolean {
    return this.handlers.has(name);
  }

  /**
   * Get all registered handler names
   */
  getHandlerNames(): string[] {
    return Array.from(this.handlers.keys()).sort();
  }

  /**
   * Clear all handlers
   */
  clear(): void {
    this.handlers.clear();
  }
}
