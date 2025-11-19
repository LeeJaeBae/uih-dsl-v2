/**
 * UIH DSL Tokenizer Usage Example
 *
 * This file demonstrates how to use the UIH DSL Tokenizer
 */

import { tokenize, TokenType, Token } from '../src';

// Example 1: Basic usage
function basicExample() {
  const input = `meta {
  title: "My Page"
  route: "/page"
}`;

  const tokens = tokenize(input);

  console.log('Tokenized output:');
  tokens.forEach(token => {
    console.log(`${token.type}: "${token.value}"`);
  });
}

// Example 2: Working with layout blocks
function layoutExample() {
  const input = `layout {
  Container(class:"wrapper") {
    Header {
      H1 {
        "Welcome"
      }
    }
    Main {
      P(class:"text-lg") {
        "This is a paragraph"
      }
    }
  }
}`;

  const tokens = tokenize(input);

  // Filter to show only important tokens
  const importantTokens = tokens.filter(t =>
    t.type !== TokenType.WHITESPACE &&
    t.type !== TokenType.NEWLINE
  );

  console.log('Layout structure tokens:');
  importantTokens.forEach(token => {
    if (token.type === TokenType.TAGNAME) {
      console.log(`  Component: ${token.value}`);
    } else if (token.type === TokenType.TEXT_STRING) {
      console.log(`  Text: "${token.value}"`);
    } else if (token.type === TokenType.IDENTIFIER && token.value === 'class') {
      console.log(`  Has class attribute`);
    }
  });
}

// Example 3: Extracting metadata
function extractMetadata() {
  const input = `meta {
  title: "Dashboard"
  route: "/dashboard"
  theme: "dark"
  published: true
}

style {
  color.primary: "#007bff"
  font.size: 14
}`;

  const tokens = tokenize(input);
  const metadata: Record<string, any> = {};

  let inMeta = false;
  let currentKey = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === TokenType.IDENTIFIER && token.value === 'meta') {
      inMeta = true;
    } else if (inMeta && token.type === TokenType.RBRACE) {
      inMeta = false;
    } else if (inMeta && token.type === TokenType.IDENTIFIER) {
      currentKey = token.value;
    } else if (inMeta && currentKey && token.type === TokenType.COLON) {
      // Next token should be the value
      const nextToken = tokens[i + 1];
      if (nextToken) {
        if (nextToken.type === TokenType.STRING) {
          metadata[currentKey] = nextToken.value;
        } else if (nextToken.type === TokenType.BOOLEAN) {
          metadata[currentKey] = nextToken.value === 'true';
        } else if (nextToken.type === TokenType.NUMBER) {
          metadata[currentKey] = Number(nextToken.value);
        }
        currentKey = '';
      }
    }
  }

  console.log('Extracted metadata:', metadata);
}

// Example 4: Validate DSL structure
function validateStructure() {
  const input = `meta {
  title: "Test"
}

style {
  color: "red"
}

layout {
  Div {
    "Content"
  }
}`;

  try {
    const tokens = tokenize(input);

    // Check for required blocks
    const hasMetaBlock = tokens.some(t => t.type === TokenType.IDENTIFIER && t.value === 'meta');
    const hasStyleBlock = tokens.some(t => t.type === TokenType.IDENTIFIER && t.value === 'style');
    const hasLayoutBlock = tokens.some(t => t.type === TokenType.IDENTIFIER && t.value === 'layout');

    console.log('Validation results:');
    console.log(`  ✓ Has meta block: ${hasMetaBlock}`);
    console.log(`  ✓ Has style block: ${hasStyleBlock}`);
    console.log(`  ✓ Has layout block: ${hasLayoutBlock}`);
    console.log(`  Total tokens: ${tokens.length}`);

  } catch (error) {
    console.error('Validation failed:', error);
  }
}

// Example 5: Handle errors gracefully
function errorHandling() {
  const invalidInputs = [
    { name: 'Tab character', input: 'meta {\ttitle: "Test" }' },
    { name: 'CRLF', input: 'meta {\r\n  title: "Test"\r\n}' },
    { name: 'Semicolon', input: 'meta { title: "Test"; }' },
    { name: 'Single quotes', input: "meta { title: 'Test' }" },
    { name: 'Backticks', input: 'meta { title: `Test` }' },
  ];

  console.log('Error handling examples:');
  invalidInputs.forEach(({ name, input }) => {
    try {
      tokenize(input);
      console.log(`  ✗ ${name}: Should have thrown an error`);
    } catch (error) {
      console.log(`  ✓ ${name}: ${error instanceof Error ? error.message : 'Error caught'}`);
    }
  });
}

// Run all examples
function runExamples() {
  console.log('UIH DSL Tokenizer Examples\n');

  console.log('1. Basic Usage:');
  console.log('=' .repeat(40));
  basicExample();

  console.log('\n2. Layout Example:');
  console.log('=' .repeat(40));
  layoutExample();

  console.log('\n3. Extract Metadata:');
  console.log('=' .repeat(40));
  extractMetadata();

  console.log('\n4. Validate Structure:');
  console.log('=' .repeat(40));
  validateStructure();

  console.log('\n5. Error Handling:');
  console.log('=' .repeat(40));
  errorHandling();
}

// Export examples
export {
  basicExample,
  layoutExample,
  extractMetadata,
  validateStructure,
  errorHandling,
  runExamples
};

// Run if executed directly
if (require.main === module) {
  runExamples();
}