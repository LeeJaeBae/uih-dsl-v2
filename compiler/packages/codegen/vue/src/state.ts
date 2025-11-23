/**
 * UIH DSL Codegen - State Machine Generator (Vue)
 *
 * Generates Vue `ref` and handler logic based on FSM IR.
 *
 * @module @uih-dsl/codegen-vue/state
 * @version 1.0.0
 */

import type { UIHIR } from "@uih-dsl/ir";

export interface StateOutput {
  refs: string[];
  handlers: string[];
}

export function generateState(ir: UIHIR): StateOutput {
  const refs: string[] = [];
  const handlers: string[] = [];

  // 1. If no state definition, return empty
  if (!ir.state || !ir.state.initial) {
    return { refs, handlers };
  }

  // 2. Generate main state ref
  // const state = ref('idle');
  refs.push(`const state = ref("${ir.state.initial}");`);

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
  // const handleClick = () => { ... }
  eventMap.forEach((transitions, eventName) => {
    const cases: string[] = [];
    transitions.forEach((targetState, currentState) => {
      cases.push(`    case "${currentState}":
      state.value = "${targetState}";
      break;`);
    });

    // Vue specific: state.value access
    const handlerCode = `const handle${capitalize(eventName)} = () => {
  switch (state.value) {
${cases.join("\n")}
    default:
      console.warn(\`Unhandled event '${eventName}' in state '\${state.value}'\`);
  }
};`;

    handlers.push(handlerCode);
  });

  return { refs, handlers };
}

function capitalize(s: string) {
  if (s.length === 0) return s;
  // Preserve original casing after first char to support handleSUBMIT matching layout
  return s.charAt(0).toUpperCase() + s.slice(1);
}
