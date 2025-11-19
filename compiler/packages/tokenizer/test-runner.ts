// Direct test runner for UIH DSL Tokenizer
import { tokenize, TokenType } from './src/index';

console.log('=====================================');
console.log('UIH DSL Tokenizer Test Runner');
console.log('=====================================\n');

// Test 1: Simple meta block
console.log('Test 1: Simple Meta Block');
console.log('--------------------------');
const test1 = `meta {
  title: "Home"
  route: "/"
}`;

try {
  const tokens1 = tokenize(test1);
  console.log('✓ Tokenized successfully');
  console.log('Tokens:', tokens1.map(t => `${t.type}${t.value ? `(${t.value})` : ''}`).join(' '));
  console.log('Total tokens:', tokens1.length);
} catch (e) {
  console.error('✗ Error:', e);
}

console.log('\n');

// Test 2: Layout with string
console.log('Test 2: Layout with String');
console.log('---------------------------');
const test2 = `layout {
  Div(class:"container") {
    "Hello World"
  }
}`;

try {
  const tokens2 = tokenize(test2);
  console.log('✓ Tokenized successfully');

  // All strings are STRING type (Parser determines context)
  const strings = tokens2.filter(t => t.type === TokenType.STRING);
  console.log(`STRING tokens found: ${strings.length}`);
  strings.forEach(s => console.log(`  - "${s.value}"`));

  console.log('Total tokens:', tokens2.length);
} catch (e) {
  console.error('✗ Error:', e);
}

console.log('\n');

// Test 3: Style with dot notation
console.log('Test 3: Style with Dot Notation');
console.log('--------------------------------');
const test3 = `style {
  color.primary: "#0E5EF7"
  font.size: 16
}`;

try {
  const tokens3 = tokenize(test3);
  console.log('✓ Tokenized successfully');

  // Find dot notation identifiers
  const dotIdentifiers = tokens3.filter(t => t.type === TokenType.IDENTIFIER && t.value.includes('.'));
  console.log('Dot notation identifiers found:', dotIdentifiers.map(t => t.value));
  console.log('Total tokens:', tokens3.length);
} catch (e) {
  console.error('✗ Error:', e);
}

console.log('\n');

// Test 4: Error case - forbidden semicolon
console.log('Test 4: Error Case - Semicolon');
console.log('-------------------------------');
const test4 = `meta {
  title: "Test";
}`;

try {
  const tokens4 = tokenize(test4);
  console.log('✗ Should have thrown an error');
} catch (e: any) {
  console.log('✓ Correctly caught error:', e.message);
}

console.log('\n');

// Test 5: Boolean values
console.log('Test 5: Boolean Values');
console.log('----------------------');
const test5 = `meta {
  published: true
  draft: false
}`;

try {
  const tokens5 = tokenize(test5);
  console.log('✓ Tokenized successfully');

  const booleans = tokens5.filter(t => t.type === TokenType.BOOLEAN);
  console.log('Boolean tokens found:', booleans.map(t => t.value));
  console.log('Total tokens:', tokens5.length);
} catch (e) {
  console.error('✗ Error:', e);
}

console.log('\n');

// Test 6: Complex layout structure
console.log('Test 6: Complex Layout Structure');
console.log('---------------------------------');
const test6 = `layout {
  Container(class:"flex flex-col") {
    Header {
      H1 {
        "Dashboard"
      }
    }
    Main(class:"p-4") {
      Card {
        "Welcome"
      }
    }
  }
}`;

try {
  const tokens6 = tokenize(test6);
  console.log('✓ Tokenized successfully');

  const tagNames = tokens6.filter(t => t.type === TokenType.TAGNAME);
  const strings = tokens6.filter(t => t.type === TokenType.STRING);

  console.log('Components found:', tagNames.map(t => t.value));
  console.log('Strings found:', strings.map(t => `"${t.value}"`));
  console.log('Total tokens:', tokens6.length);
} catch (e) {
  console.error('✗ Error:', e);
}

console.log('\n=====================================');
console.log('Test Summary');
console.log('=====================================');