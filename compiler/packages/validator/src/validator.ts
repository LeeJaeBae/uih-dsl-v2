import type { Range } from "@uih-dsl/tokenizer";
import type {
  ASTRoot,
  Attribute,
  LayoutComponent,
  LayoutElement,
  LayoutText,
  MetaProperty,
  ScriptProperty,
  StyleProperty,
} from "@uih-dsl/parser";
import type { UIHIR } from "@uih-dsl/ir";

export type ValidationTarget = "ast" | "ir";

export interface ValidationError {
  message: string;
  line?: number;
  column?: number;
  target: ValidationTarget;
}

export interface ValidationResult {
  errors: ValidationError[];
}

const CAMEL_CASE_REGEX = /^[a-z][a-zA-Z0-9]*$/;

function pushError(
  errors: ValidationError[],
  target: ValidationTarget,
  message: string,
  location?: Range
): void {
  if (location) {
    errors.push({
      message,
      target,
      line: location.start.line,
      column: location.start.column,
    });
  } else {
    errors.push({
      message,
      target,
    });
  }
}

export function validateAST(ast: ASTRoot | null): ValidationResult {
  const errors: ValidationError[] = [];

  if (!ast) {
    errors.push({
      message: "AST is null; parsing failed",
      target: "ast",
    });
    return { errors };
  }

  validateMeta(ast.meta.properties, errors);
  validateStyle(ast.style.properties, errors);

  if (ast.components) {
    validateComponentNames(ast.components.components, errors);
  }

  validateLayout(ast.layout.children, errors, true);

  if (ast.script) {
    validateScript(ast.script.events, errors);
  }

  return { errors };
}

export function validateIR(ir: UIHIR | null): ValidationResult {
  const errors: ValidationError[] = [];

  if (!ir) {
    errors.push({
      message: "IR is null; translation failed",
      target: "ir",
    });
    return { errors };
  }

  if (ir.layout.length === 0) {
    errors.push({
      message: "Layout must contain at least one element",
      target: "ir",
    });
  }

  ir.style.tokens.forEach((token) => {
    if (token.path.length < 2) {
      errors.push({
        message: `Style token '${token.path.join(".")}' must include at least two segments`,
        target: "ir",
      });
    }
  });

  ir.script.forEach((entry) => {
    if (!CAMEL_CASE_REGEX.test(entry.event)) {
      errors.push({
        message: `Script event '${entry.event}' must be in camelCase`,
        target: "ir",
      });
    }

    if (entry.handler.trim() === "") {
      errors.push({
        message: `Script handler for '${entry.event}' cannot be empty`,
        target: "ir",
      });
    }
  });

  return { errors };
}

function validateMeta(properties: MetaProperty[], errors: ValidationError[]): void {
  const seenKeys = new Set<string>();

  properties.forEach((prop) => {
    if (seenKeys.has(prop.key)) {
      pushError(errors, "ast", `Duplicate meta key '${prop.key}'`, prop.location);
    } else {
      seenKeys.add(prop.key);
    }
  });
}

function validateStyle(properties: StyleProperty[], errors: ValidationError[]): void {
  const seenKeys = new Set<string>();

  properties.forEach((prop) => {
    if (seenKeys.has(prop.key)) {
      pushError(errors, "ast", `Duplicate style key '${prop.key}'`, prop.location);
    } else {
      seenKeys.add(prop.key);
    }

    const path = prop.key.split(".");
    if (path.length < 2) {
      pushError(
        errors,
        "ast",
        `Style key '${prop.key}' must use dot notation (e.g., color.primary)`,
        prop.location
      );
    }

    if (typeof prop.value === "boolean") {
      pushError(errors, "ast", `Style '${prop.key}' cannot be a boolean`, prop.location);
    }
  });
}

function validateComponentNames(
  components: { name: string; location: Range }[],
  errors: ValidationError[]
): void {
  const seenNames = new Set<string>();

  components.forEach((comp) => {
    if (seenNames.has(comp.name)) {
      pushError(errors, "ast", `Duplicate component name '${comp.name}'`, comp.location);
    } else {
      seenNames.add(comp.name);
    }
  });
}

function validateLayout(elements: LayoutElement[], errors: ValidationError[], isRoot: boolean = false): void {
  if (isRoot && elements.length === 0) {
    errors.push({
      message: "Layout must contain at least one element",
      target: "ast",
    });
    return;
  }

  elements.forEach((element) => {
    if (element.type === "Component") {
      validateLayoutComponent(element, errors);
      validateLayout(element.children, errors);
    } else {
      validateLayoutText(element, errors);
    }
  });
}

function validateLayoutComponent(
  component: LayoutComponent,
  errors: ValidationError[]
): void {
  const seenAttrKeys = new Set<string>();

  component.attributes.forEach((attr: Attribute) => {
    if (attr.key !== attr.key.toLowerCase()) {
      pushError(
        errors,
        "ast",
        `Attribute '${attr.key}' must be lowercase`,
        attr.location
      );
    }

    if (seenAttrKeys.has(attr.key)) {
      pushError(errors, "ast", `Duplicate attribute '${attr.key}'`, attr.location);
    } else {
      seenAttrKeys.add(attr.key);
    }
  });
}

function validateLayoutText(_textNode: LayoutText, _errors: ValidationError[]): void {
  // Text nodes are allowed to be empty (e.g. placeholders)
}

function validateScript(events: ScriptProperty[], errors: ValidationError[]): void {
  const seenEvents = new Set<string>();

  events.forEach((event) => {
    if (!CAMEL_CASE_REGEX.test(event.key)) {
      pushError(
        errors,
        "ast",
        `Script key '${event.key}' must be in camelCase format`,
        event.location
      );
    }

    if (event.value.trim() === "") {
      pushError(errors, "ast", `Script handler for '${event.key}' cannot be empty`, event.location);
    }

    if (seenEvents.has(event.key)) {
      pushError(errors, "ast", `Duplicate script key '${event.key}'`, event.location);
    } else {
      seenEvents.add(event.key);
    }
  });
}
