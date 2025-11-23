/**
 * UIH DSL Codegen - State Machine Generator (Svelte)
 *
 * Generates Svelte 5 `$state` runes and handler logic based on FSM IR.
 *
 * @module @uih-dsl/codegen-svelte/state
 * @version 1.0.0
 */

import type { UIHIR } from "@uih-dsl/ir";

export interface StateOutput {
  state: string[];
  handlers: string[];
}

export function generateState(ir: UIHIR): StateOutput {
  const state: string[] = [];
  const handlers: string[] = [];

  // 1. If no state definition, return empty
  if (!ir.state || !ir.state.initial) {
    return { state, handlers };
  }

  // 2. Generate main state rune
  // let currentState = $state('idle');
  // We use `currentState` to avoid conflict with `state` reserved word potentially, 
  // but let's stick to `state` for consistency if possible, or `uiState`.
  // Let's use `state` as variable name as in other frameworks.
  state.push(`let state = $state("${ir.state.initial}");`);

  // 3. Collect all unique events from transitions
  const eventMap = new Map<string, Map<string, string>>(); // Event -> (CurrentState -> TargetState)

  ir.state.states.forEach((stateDef) => {
    stateDef.transitions.forEach((transition) => {
      if (!eventMap.has(transition.event)) {
        eventMap.set(transition.event, new Map());
      }
      eventMap.get(transition.event)!.set(stateDef.name, transition.target);
    });
  });

  // 4. Generate handlers for each event
  // function handleClick() { ... }
  eventMap.forEach((transitions, eventName) => {
    const cases: string[] = [];
    transitions.forEach((targetState, currentState) => {
      cases.push(`    case "${currentState}":
      state = "${targetState}";
      break;`);
    });

    // Svelte 5: simple assignment to state rune triggers update
    const handlerCode = `function handle${capitalize(eventName)}() {
  switch (state) {
${cases.join("\n")}
    default:
      console.warn(\`Unhandled event '${eventName}' in state '\${state}'\`);
  }
}`;

    handlers.push(handlerCode);
  });

  return { state, handlers };
}

function capitalize(s: string) {
  if (s.length === 0) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
