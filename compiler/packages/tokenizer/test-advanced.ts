// Advanced tests for UIH DSL Tokenizer
import { tokenize, TokenType } from './src/index';

console.log('=====================================');
console.log('UIH DSL Tokenizer - Advanced Tests');
console.log('=====================================\n');

// Test: Complete DSL file
const completeDSL = `meta {
  title: "Dashboard"
  route: "/dashboard"
  theme: "dark"
  published: true
}

style {
  color.primary: "#0E5EF7"
  color.secondary: "#6B7280"
  padding.default: 16
  border.radius: 8
}

components {
  Button {
    variant: "primary"
  }
  Card {
    shadow: true
  }
}

layout {
  Container(class:"flex flex-col min-h-screen") {
    Header(class:"p-4 bg-blue-600 text-white") {
      H1 {
        "Dashboard"
      }
      Nav {
        Button(onClick:"handleClick") {
          "Click me"
        }
      }
    }
    Main(class:"flex-1 p-6") {
      Card(class:"bg-white shadow-lg rounded-lg p-6") {
        H2 {
          "Welcome to your dashboard"
        }
        P(class:"text-gray-600") {
          "This is a paragraph with some text content."
        }
        Div {
          Button(disabled:true) {
            "Disabled Button"
          }
        }
      }
    }
    Footer {
      P {
        "© 2024 Company Name"
      }
    }
  }
}

script {
  onClick: "handleClick"
  onSubmit: "handleSubmit"
}`;

console.log('Test: Complete DSL File');
console.log('========================');

try {
  const tokens = tokenize(completeDSL);
  console.log('✓ Successfully tokenized complete DSL');

  // Count different token types
  const tokenCounts: Record<string, number> = {};
  tokens.forEach(token => {
    tokenCounts[token.type] = (tokenCounts[token.type] || 0) + 1;
  });

  console.log('\nToken Statistics:');
  console.log('----------------');
  Object.entries(tokenCounts).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });

  // Extract all TagNames
  const tagNames = tokens.filter(t => t.type === TokenType.TAGNAME).map(t => t.value);
  console.log('\nComponents used:', [...new Set(tagNames)]);

  // Extract all STRING content
  const stringContent = tokens.filter(t => t.type === TokenType.STRING).map(t => t.value);
  console.log('\nString content found:');
  stringContent.forEach(text => console.log(`  - "${text}"`));

  // Check dot notation identifiers
  const dotIdentifiers = tokens.filter(t => t.type === TokenType.IDENTIFIER && t.value.includes('.')).map(t => t.value);
  console.log('\nDot notation properties:', dotIdentifiers);

  console.log(`\n✓ Total tokens: ${tokens.length}`);
} catch (e) {
  console.error('✗ Error:', e);
}

console.log('\n=====================================');
console.log('Error Testing');
console.log('=====================================\n');

// Various error cases
const errorCases = [
  {
    name: 'Tab character',
    input: 'meta {\n\ttitle: "Test"\n}'
  },
  {
    name: 'CRLF line ending',
    input: 'meta {\r\n  title: "Test"\r\n}'
  },
  {
    name: 'Semicolon',
    input: 'meta { title: "Test"; }'
  },
  {
    name: 'Single quotes',
    input: "meta { title: 'Test' }"
  },
  {
    name: 'Backticks',
    input: 'meta { title: `Test` }'
  },
  {
    name: 'Equal sign',
    input: 'meta { title = "Test" }'
  },
  {
    name: 'Plus sign',
    input: 'meta { value: 1 + 2 }'
  },
  {
    name: 'Hash sign',
    input: 'meta { #comment }'
  },
  {
    name: 'At sign',
    input: 'meta { @directive }'
  }
];

console.log('Testing forbidden characters and patterns:');
console.log('------------------------------------------');

errorCases.forEach(({ name, input }) => {
  try {
    tokenize(input);
    console.log(`✗ ${name}: Should have thrown an error`);
  } catch (e: any) {
    const errorMsg = e.message.split(':').slice(-1)[0].trim();
    console.log(`✓ ${name}: Caught - "${errorMsg}"`);
  }
});

console.log('\n=====================================');
console.log('Edge Cases Testing');
console.log('=====================================\n');

// Test: Empty blocks
console.log('1. Empty blocks:');
try {
  const emptyBlocks = `meta {}
style {}
layout {}`;
  const tokens = tokenize(emptyBlocks);
  console.log('✓ Empty blocks tokenized successfully');
  console.log(`  Token count: ${tokens.length}`);
} catch (e) {
  console.error('✗ Error:', e);
}

// Test: Nested layout structures
console.log('\n2. Deep nesting (5 levels):');
try {
  const deepNesting = `layout {
  A {
    B {
      C {
        D {
          E {
            "Deep text"
          }
        }
      }
    }
  }
}`;
  const tokens = tokenize(deepNesting);
  const depth = tokens.filter(t => t.type === TokenType.LBRACE).length - 1; // -1 for layout block itself
  console.log(`✓ Tokenized ${depth} levels of nesting`);
} catch (e) {
  console.error('✗ Error:', e);
}

// Test: Escaped quotes in strings
console.log('\n3. Escaped quotes:');
try {
  const escapedQuotes = `meta {
  title: "He said \\"Hello\\" to me"
  message: "Line with \\"multiple\\" escaped \\"quotes\\""
}`;
  const tokens = tokenize(escapedQuotes);
  const strings = tokens.filter(t => t.type === TokenType.STRING);
  console.log('✓ Escaped quotes handled:');
  strings.forEach(s => console.log(`  - "${s.value}"`));
} catch (e) {
  console.error('✗ Error:', e);
}

// Test: Numbers with decimals
console.log('\n4. Various number formats:');
try {
  const numbers = `style {
  integer: 42
  decimal: 3.14
  zero: 0
  small: 0.001
  large: 999999
}`;
  const tokens = tokenize(numbers);
  const nums = tokens.filter(t => t.type === TokenType.NUMBER);
  console.log('✓ Numbers parsed:');
  nums.forEach(n => console.log(`  - ${n.value}`));
} catch (e) {
  console.error('✗ Error:', e);
}

// Test: Multiple attributes
console.log('\n5. Multiple attributes on components:');
try {
  const multiAttrs = `layout {
  Button(class:"btn btn-primary", onClick:"handleClick", disabled:true, aria-label:"Submit") {
    "Submit"
  }
}`;
  const tokens = tokenize(multiAttrs);
  const attrs = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === TokenType.IDENTIFIER && tokens[i + 1]?.type === TokenType.COLON) {
      attrs.push(tokens[i].value);
    }
  }
  console.log('✓ Attributes found:', attrs);
} catch (e) {
  console.error('✗ Error:', e);
}

console.log('\n=====================================');
console.log('All Advanced Tests Completed!');
console.log('=====================================');