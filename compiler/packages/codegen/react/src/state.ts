/**
 * UIH DSL Codegen - State Machine Generator (React)
 *
 * Generates useState hooks and event handler logic based on the FSM IR.
 *
 * Strategy:
 * - Use `useState` for the current state (e.g., `const [state, setState] = useState('initial');`).
 * - Generate handler functions for each unique event found in the transitions.
 * - Inside each handler, generate a switch/case block to handle state transitions.
 *
 * @module @uih-dsl/codegen-react/state
 * @version 1.0.0
 */

import type { UIHIR } from "@uih-dsl/ir";

export interface StateOutput {
  hooks: string[];
  handlers: string[];
}

export function generateState(ir: UIHIR): StateOutput {
  const hooks: string[] = [];
  const handlers: string[] = [];

  // 1. If no state definition, return empty
  if (!ir.state || !ir.state.initial) {
    return { hooks, handlers };
  }

  // 2. Generate main state hook
  // const [state, setState] = React.useState('idle');
  hooks.push(`const [state, setState] = React.useState("${ir.state.initial}");`);

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
    // Helper to generate the switch statement
    const cases: string[] = [];
    transitions.forEach((targetState, currentState) => {
      cases.push(`      case "${currentState}":
        setState("${targetState}");
        break;`);
    });

    const handlerCode = `const handle${capitalize(eventName)} = () => {
    switch (state) {
${cases.join("\n")}
      default:
        console.warn(\`Unhandled event '${eventName}' in state '\${state}'\`);
    }
  };`;

    handlers.push(handlerCode);
  });

  return { hooks, handlers };
}

function capitalize(s: string) {
  if (s.length === 0) return s;
  // Preserve original casing after first char to support handleSUBMIT matching layout
  return s.charAt(0).toUpperCase() + s.slice(1);
}
