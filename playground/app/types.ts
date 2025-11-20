export interface CompileError {
  message: string;
  line: number;
  column: number;
}

export interface CompileResult {
  ast: any;
  ir: any;
  code: string;
  errors: CompileError[];
}

export type Framework = "react" | "vue" | "svelte";
