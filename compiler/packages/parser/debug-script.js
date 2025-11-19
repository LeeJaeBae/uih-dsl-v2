import { tokenize } from "@uih-dsl/tokenizer";

const input = `
layout {
  Div {
    "Content"
  }
}

script {
  onClick: "handleClick"
  onLoad: "initialize"
}
`;

console.log("=== Tokenizing script block ===\n");
const tokens = tokenize(input);

console.log("Tokens:");
tokens.forEach((t, i) => {
  if (t.type !== "NEWLINE") {
    console.log(`${i}: ${t.type} = "${t.value}" (line ${t.range.start.line})`);
  }
});
