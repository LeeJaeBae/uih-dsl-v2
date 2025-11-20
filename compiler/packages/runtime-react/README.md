# @uih-dsl/runtime-react

React runtime components for UIH DSL generated code.

[![npm version](https://img.shields.io/npm/v/@uih-dsl/runtime-react.svg)](https://www.npmjs.com/package/@uih-dsl/runtime-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @uih-dsl/runtime-react
```

### Peer Dependencies

This package requires React 18+:

```bash
npm install react@^18.0.0 react-dom@^18.0.0
```

## Usage

### Basic Usage

UIH compiled components automatically import from this runtime:

```tsx
import { Container, H1, Text, VStack } from '@uih-dsl/runtime-react';

export function MyComponent() {
  return (
    <Container padding="16px">
      <VStack spacing="8px">
        <H1 color="#0E5EF7">Hello World</H1>
        <Text>This is a UIH component</Text>
      </VStack>
    </Container>
  );
}
```

### Available Components

#### Layout Components

**Container**

Main container component with configurable padding, margin, and layout properties.

```tsx
<Container
  padding="16px"
  margin="8px"
  maxWidth="1200px"
  centered
>
  Content
</Container>
```

Props:
- `padding?: string` - Padding (supports design tokens)
- `margin?: string` - Margin (supports design tokens)
- `maxWidth?: string` - Maximum width
- `centered?: boolean` - Center the container
- `className?: string` - Custom CSS class
- `style?: CSSProperties` - Inline styles

**VStack**

Vertical stack layout with configurable spacing.

```tsx
<VStack spacing="16px" align="center">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</VStack>
```

Props:
- `spacing?: string` - Space between items
- `align?: 'start' | 'center' | 'end' | 'stretch'` - Alignment
- `className?: string` - Custom CSS class

**HStack**

Horizontal stack layout with configurable spacing.

```tsx
<HStack spacing="8px" align="center">
  <div>Item 1</div>
  <div>Item 2</div>
</HStack>
```

Props:
- `spacing?: string` - Space between items
- `align?: 'start' | 'center' | 'end' | 'stretch'` - Alignment
- `className?: string` - Custom CSS class

**Grid**

Grid layout component.

```tsx
<Grid columns={3} gap="16px">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

Props:
- `columns?: number | string` - Number of columns or template
- `rows?: number | string` - Number of rows or template
- `gap?: string` - Gap between items
- `className?: string` - Custom CSS class

#### Typography Components

**H1 - H6**

Heading components with built-in styling.

```tsx
<H1 color="#333" fontSize="32px">Main Heading</H1>
<H2 color="#555" fontSize="24px">Subheading</H2>
```

Props:
- `color?: string` - Text color
- `fontSize?: string` - Font size
- `fontWeight?: string | number` - Font weight
- `className?: string` - Custom CSS class

**Text**

Generic text component.

```tsx
<Text color="#666" fontSize="16px">
  Paragraph text
</Text>
```

Props:
- `color?: string` - Text color
- `fontSize?: string` - Font size
- `fontWeight?: string | number` - Font weight
- `lineHeight?: string` - Line height
- `className?: string` - Custom CSS class

#### Interactive Components

**Button**

Button component with variant support.

```tsx
<Button
  variant="primary"
  size="medium"
  onClick={handleClick}
>
  Click me
</Button>
```

Props:
- `variant?: 'primary' | 'secondary' | 'outline' | 'ghost'` - Button style variant
- `size?: 'small' | 'medium' | 'large'` - Button size
- `disabled?: boolean` - Disabled state
- `onClick?: () => void` - Click handler
- `type?: 'button' | 'submit' | 'reset'` - Button type
- `className?: string` - Custom CSS class

**Input**

Form input component.

```tsx
<Input
  type="text"
  placeholder="Enter your name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

Props:
- `type?: string` - Input type
- `placeholder?: string` - Placeholder text
- `value?: string` - Input value
- `onChange?: (e: ChangeEvent<HTMLInputElement>) => void` - Change handler
- `disabled?: boolean` - Disabled state
- `className?: string` - Custom CSS class

#### Data Display

**Card**

Card container component.

```tsx
<Card padding="24px" elevation={2}>
  Card content
</Card>
```

Props:
- `padding?: string` - Internal padding
- `elevation?: number` - Shadow elevation (0-5)
- `border?: string` - Border style
- `borderRadius?: string` - Border radius
- `className?: string` - Custom CSS class

**Avatar**

Avatar/profile picture component.

```tsx
<Avatar
  src="https://example.com/avatar.jpg"
  alt="User"
  size="48px"
/>
```

Props:
- `src?: string` - Image source
- `alt?: string` - Alt text
- `size?: string` - Avatar size
- `fallback?: string` - Fallback initials
- `className?: string` - Custom CSS class

**Badge**

Badge/label component.

```tsx
<Badge variant="success">New</Badge>
```

Props:
- `variant?: 'default' | 'success' | 'warning' | 'error'` - Badge variant
- `className?: string` - Custom CSS class

## Design Tokens

The runtime supports design tokens defined in your UIH files:

```tsx
// UIH file defines:
// color.primary: "#0E5EF7"
// spacing.md: "16px"

// In generated code:
<Container padding="spacing.md">
  <H1 color="color.primary">Hello</H1>
</Container>

// Runtime automatically resolves to:
<Container padding="16px">
  <H1 color="#0E5EF7">Hello</H1>
</Container>
```

### Custom Token Provider

You can override tokens at runtime:

```tsx
import { TokenProvider } from '@uih-dsl/runtime-react';

function App() {
  const customTokens = {
    'color.primary': '#FF0000',
    'spacing.md': '20px'
  };

  return (
    <TokenProvider tokens={customTokens}>
      <YourUIHComponent />
    </TokenProvider>
  );
}
```

## Event Handling

Components support standard React event handlers:

```tsx
<Button onClick={handleClick}>
  Click me
</Button>

<Input
  onChange={(e) => setValue(e.target.value)}
  onFocus={handleFocus}
  onBlur={handleBlur}
/>
```

## Styling

### Default Styles

All components come with sensible default styles that match modern UI patterns.

### Custom Styling

#### CSS Classes

```tsx
<Container className="my-custom-class">
  Content
</Container>
```

#### Inline Styles

```tsx
<Container style={{ background: 'linear-gradient(...)' }}>
  Content
</Container>
```

#### Styled Components

```tsx
import styled from 'styled-components';
import { Container } from '@uih-dsl/runtime-react';

const StyledContainer = styled(Container)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
`;
```

#### Tailwind CSS

```tsx
<Container className="bg-blue-500 rounded-lg p-4">
  Content
</Container>
```

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import type {
  ContainerProps,
  VStackProps,
  ButtonProps,
  InputProps
} from '@uih-dsl/runtime-react';

const MyContainer: React.FC<ContainerProps> = (props) => {
  return <Container {...props} />;
};
```

## Server Components (Next.js 13+)

All layout components are compatible with React Server Components:

```tsx
// app/page.tsx
import { Container, H1 } from '@uih-dsl/runtime-react';

export default function Page() {
  return (
    <Container>
      <H1>Server Component</H1>
    </Container>
  );
}
```

Interactive components require `"use client"`:

```tsx
'use client';

import { Button } from '@uih-dsl/runtime-react';

export function InteractiveButton() {
  return <Button onClick={() => alert('Clicked!')}>Click</Button>;
}
```

## Performance

### Tree Shaking

The package is optimized for tree shaking. Only import what you need:

```tsx
// ✅ Good - only imports Button
import { Button } from '@uih-dsl/runtime-react';

// ❌ Avoid - imports everything
import * as UIH from '@uih-dsl/runtime-react';
```

### Bundle Size

| Component | Gzipped |
|-----------|---------|
| Container | ~0.5 KB |
| VStack/HStack | ~0.6 KB |
| Button | ~1.2 KB |
| Input | ~0.8 KB |
| Card | ~0.4 KB |

## Accessibility

All components follow WAI-ARIA guidelines:

- Semantic HTML elements
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader friendly

Example:

```tsx
<Button
  aria-label="Submit form"
  aria-disabled={isDisabled}
>
  Submit
</Button>
```

## Examples

### Form Layout

```tsx
import { Container, VStack, Input, Button } from '@uih-dsl/runtime-react';

function LoginForm() {
  return (
    <Container maxWidth="400px" centered padding="24px">
      <VStack spacing="16px">
        <Input
          type="email"
          placeholder="Email"
          name="email"
        />
        <Input
          type="password"
          placeholder="Password"
          name="password"
        />
        <Button variant="primary" type="submit">
          Log In
        </Button>
      </VStack>
    </Container>
  );
}
```

### Dashboard Layout

```tsx
import { Container, Grid, Card, H2, Text } from '@uih-dsl/runtime-react';

function Dashboard() {
  return (
    <Container padding="24px">
      <Grid columns={3} gap="16px">
        <Card padding="20px" elevation={1}>
          <H2>Users</H2>
          <Text>1,234</Text>
        </Card>
        <Card padding="20px" elevation={1}>
          <H2>Revenue</H2>
          <Text>$56,789</Text>
        </Card>
        <Card padding="20px" elevation={1}>
          <H2>Orders</H2>
          <Text>432</Text>
        </Card>
      </Grid>
    </Container>
  );
}
```

### User Profile

```tsx
import { Container, HStack, VStack, Avatar, H3, Text, Button } from '@uih-dsl/runtime-react';

function UserProfile() {
  return (
    <Container padding="24px">
      <HStack spacing="16px" align="start">
        <Avatar
          src="/avatar.jpg"
          alt="User"
          size="64px"
          fallback="JD"
        />
        <VStack spacing="8px">
          <H3>John Doe</H3>
          <Text color="#666">Software Engineer</Text>
          <Button variant="outline" size="small">
            Edit Profile
          </Button>
        </VStack>
      </HStack>
    </Container>
  );
}
```

## Migration from Other Libraries

### From Chakra UI

```tsx
// Chakra UI
<Box p="4" bg="blue.500">
  <Text>Hello</Text>
</Box>

// UIH Runtime
<Container padding="16px" style={{ background: '#3182ce' }}>
  <Text>Hello</Text>
</Container>
```

### From Material-UI

```tsx
// Material-UI
<Box display="flex" flexDirection="column" gap={2}>
  <Typography variant="h1">Title</Typography>
</Box>

// UIH Runtime
<VStack spacing="16px">
  <H1>Title</H1>
</VStack>
```

## Troubleshooting

### Styles Not Applying

Ensure you're importing the base styles:

```tsx
import '@uih-dsl/runtime-react/styles.css';
```

### TypeScript Errors

Update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@uih-dsl/runtime-react"]
  }
}
```

### SSR/Next.js Issues

For Next.js, add to `next.config.js`:

```javascript
module.exports = {
  transpilePackages: ['@uih-dsl/runtime-react']
};
```

## Related Packages

- [@uih-dsl/cli](https://www.npmjs.com/package/@uih-dsl/cli) - CLI tool
- [@uih-dsl/runtime-core](https://www.npmjs.com/package/@uih-dsl/runtime-core) - Core runtime
- [@uih-dsl/codegen-react](https://www.npmjs.com/package/@uih-dsl/codegen-react) - React code generator

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../../CONTRIBUTING.md)

## Support

- [Documentation](https://github.com/yourusername/uih-v2)
- [Issue Tracker](https://github.com/yourusername/uih-v2/issues)
