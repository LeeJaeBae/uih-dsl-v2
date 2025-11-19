/**
 * UIH DSL Tokenizer Test Samples
 *
 * This file contains sample inputs and expected outputs for testing the tokenizer.
 * Run these tests to verify the tokenizer implementation.
 */

import { tokenize, TokenType, Token } from '../src';

// Test sample DSL inputs
const samples = {
  // Simple meta block
  simpleMeta: `meta {
  title: "Home"
  route: "/"
}`,

  // Style block with dot notation
  styleBlock: `style {
  color.primary: "#0E5EF7"
  font.size: 16
}`,

  // Layout with text strings
  layoutWithText: `layout {
  Div(class:"container") {
    "Hello World"
  }
}`,

  // Complete example
  complete: `meta {
  title: "Dashboard"
  route: "/dashboard"
}

style {
  color.primary: "#0E5EF7"
  padding.default: 16
}

layout {
  Container(class:"flex flex-col") {
    Header {
      H1 {
        "Dashboard"
      }
    }
    Main(class:"p-4") {
      Card {
        P {
          "Welcome to your dashboard"
        }
      }
    }
  }
}`,

  // Boolean values
  withBoolean: `meta {
  published: true
  draft: false
}`,

  // Multiple attributes
  multipleAttributes: `layout {
  Button(class:"btn", onClick:"handleClick", disabled:true) {
    "Click me"
  }
}`
};

// Helper function to print tokens nicely
function printTokens(tokens: Token[]) {
  console.log('Tokens:');
  tokens.forEach((token, index) => {
    const value = token.type === TokenType.NEWLINE ? '\\n' : token.value;
    console.log(`  [${index}] ${token.type}${value ? `(${value})` : ''} @ L${token.range.start.line}:${token.range.start.column}`);
  });
}

// Test function
function testTokenizer(name: string, input: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Test: ${name}`);
  console.log(`${'='.repeat(60)}`);
  console.log('Input:');
  console.log(input);
  console.log('-'.repeat(60));

  try {
    const tokens = tokenize(input);
    printTokens(tokens);
    console.log(`✓ Successfully tokenized ${tokens.length} tokens`);
    return tokens;
  } catch (error) {
    console.error(`✗ Error: ${error instanceof Error ? error.message : error}`);
    return null;
  }
}

// Run tests
function runTests() {
  console.log('UIH DSL Tokenizer Test Suite');
  console.log('============================\n');

  // Test each sample
  testTokenizer('Simple Meta Block', samples.simpleMeta);
  testTokenizer('Style Block with Dot Notation', samples.styleBlock);
  testTokenizer('Layout with Text Strings', samples.layoutWithText);
  testTokenizer('Boolean Values', samples.withBoolean);
  testTokenizer('Multiple Attributes', samples.multipleAttributes);
  testTokenizer('Complete Example', samples.complete);

  // Test error cases
  console.log(`\n${'='.repeat(60)}`);
  console.log('Error Cases');
  console.log(`${'='.repeat(60)}`);

  // Test forbidden characters
  testTokenizer('Forbidden Character (semicolon)', 'meta { title: "Test"; }');
  testTokenizer('Forbidden Character (backtick)', 'meta { title: `Test` }');
  testTokenizer('Tab Character', 'meta {\ttitle: "Test" }');
  testTokenizer('CRLF Line Ending', 'meta {\r\n  title: "Test"\r\n}');
}

// Export test runner
export { runTests, samples, testTokenizer };

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}