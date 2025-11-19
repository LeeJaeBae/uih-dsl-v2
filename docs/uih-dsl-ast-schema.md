# UIH DSL — AST Schema Definition (Complete)

## Overview

Parser BNF 위에서 생성되는 최종 AST 구조입니다. 모든 UIH DSL 요소가 이 스키마에 따라 구조화됩니다.

## Rules

### 1. AST Root

#### ASTRoot
```typescript
{
  type: "Program"
  meta: MetaNode
  style: StyleNode
  components: ComponentsNode | null
  layout: LayoutNode
  script: ScriptNode | null
}
```

### 2. Meta Node

#### MetaNode
```typescript
{
  type: "Meta"
  properties: MetaProperty[]
}
```

#### MetaProperty
```typescript
{
  key: string         // e.g. "title"
  value: string|number|boolean
  location: Range     // from tokenizer
}
```

### 3. Style Node

#### StyleNode
```typescript
{
  type: "Style"
  properties: StyleProperty[]
}
```

#### StyleProperty
```typescript
{
  key: string         // e.g. "color.primary"
  value: string|number
  location: Range
}
```

### 4. Components Node

#### ComponentsNode
```typescript
{
  type: "Components"
  components: ComponentEntry[]
}
```

#### ComponentEntry
```typescript
{
  name: string        // e.g. "Card"
  location: Range
}
```

### 5. Layout Node (Core Tree Structure)

#### LayoutNode
```typescript
{
  type: "Layout"
  children: LayoutElement[]     // top-level nodes inside layout block
}
```

#### LayoutElement
```typescript
LayoutElement = LayoutComponent | LayoutText
```

#### 5.1 Layout Component
```typescript
LayoutComponent {
  type: "Component"
  tag: string                   // e.g. "Div", "P", "Header"
  attributes: Attribute[]
  children: LayoutElement[]     // nested structure
  location: Range
}
```

#### Attribute
```typescript
{
  key: string                   // lower-case only
  value: string                 // inline string only
  location: Range
}
```

#### 5.2 Layout Text Node
```typescript
LayoutText {
  type: "Text"
  value: string                 // raw text string
  location: Range
}
```

### 6. Script Node

#### ScriptNode
```typescript
{
  type: "Script"
  events: ScriptProperty[]
}
```

#### ScriptProperty
```typescript
{
  key: string                   // e.g. "onClick"
  value: string                 // e.g. "submitForm"
  location: Range
}
```

### 7. Range Object (Source Location)

#### Range
```typescript
{
  start: Position
  end: Position
}
```

#### Position
```typescript
{
  line: number
  column: number
}
```

### 8. Semantics Rules (Validation Layer)

1. Meta keys must be from allowlist:
   - title, route, theme, description

2. Style keys may use dot notation but MUST be lowercase.

3. Components must be names only, no properties.

4. Layout:
   - tag must be a valid TagName or valid identifier
   - attributes must be string-only
   - children: array of LayoutElement (component or text)

5. Script:
   - keys must be known event names
   - value must be string (function name)

6. No null children arrays. Use `[]` if empty.

7. All nodes must have location data.

### 9. Example: Full AST for a Simple Page

#### Example DSL
```
meta {
  title: "Home"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div(class:"p-4") {
    "Hello"
  }
}
```

#### Generated AST (simplified)
```json
{
  "type": "Program",
  "meta": {
    "type": "Meta",
    "properties": [
      { "key": "title", "value": "Home" },
      { "key": "route", "value": "/" }
    ]
  },
  "style": {
    "type": "Style",
    "properties": [
      { "key": "color.primary", "value": "#0E5EF7" }
    ]
  },
  "components": null,
  "layout": {
    "type": "Layout",
    "children": [
      {
        "type": "Component",
        "tag": "Div",
        "attributes": [
          { "key": "class", "value": "p-4" }
        ],
        "children": [
          { "type": "Text", "value": "Hello" }
        ]
      }
    ]
  },
  "script": null
}
```

## Structure

```
ASTRoot (Program)
├── meta (MetaNode)
│   └── properties[] (MetaProperty)
├── style (StyleNode)
│   └── properties[] (StyleProperty)
├── components (ComponentsNode | null)
│   └── components[] (ComponentEntry)
├── layout (LayoutNode)
│   └── children[] (LayoutElement)
│       ├── LayoutComponent
│       │   ├── attributes[] (Attribute)
│       │   └── children[] (LayoutElement)
│       └── LayoutText
└── script (ScriptNode | null)
    └── events[] (ScriptProperty)
```

## Examples

### 최소 AST 구조
```json
{
  "type": "Program",
  "meta": {
    "type": "Meta",
    "properties": [
      {"key": "title", "value": "Minimal"}
    ]
  },
  "style": {
    "type": "Style",
    "properties": []
  },
  "components": null,
  "layout": {
    "type": "Layout",
    "children": [
      {
        "type": "Text",
        "value": "Content"
      }
    ]
  },
  "script": null
}
```

### 복잡한 레이아웃 AST
```json
{
  "type": "Layout",
  "children": [
    {
      "type": "Component",
      "tag": "Div",
      "attributes": [
        {"key": "class", "value": "container"}
      ],
      "children": [
        {
          "type": "Component",
          "tag": "Header",
          "attributes": [],
          "children": [
            {
              "type": "Component",
              "tag": "H1",
              "attributes": [],
              "children": [
                {"type": "Text", "value": "Title"}
              ]
            }
          ]
        },
        {
          "type": "Component",
          "tag": "Main",
          "attributes": [
            {"key": "class", "value": "content"}
          ],
          "children": [
            {"type": "Text", "value": "Main content"}
          ]
        }
      ]
    }
  ]
}
```

### 전체 블록 포함 AST
```json
{
  "type": "Program",
  "meta": {
    "type": "Meta",
    "properties": [
      {"key": "title", "value": "Full Example"},
      {"key": "theme", "value": "dark"}
    ]
  },
  "style": {
    "type": "Style",
    "properties": [
      {"key": "color.primary", "value": "#0E5EF7"},
      {"key": "font.family", "value": "Inter"}
    ]
  },
  "components": {
    "type": "Components",
    "components": [
      {"name": "Card"},
      {"name": "Button"}
    ]
  },
  "layout": {
    "type": "Layout",
    "children": [
      {
        "type": "Component",
        "tag": "Container",
        "attributes": [
          {"key": "class", "value": "flex flex-col"}
        ],
        "children": [
          {
            "type": "Component",
            "tag": "Card",
            "attributes": [
              {"key": "class", "value": "shadow-lg"}
            ],
            "children": [
              {
                "type": "Component",
                "tag": "Button",
                "attributes": [
                  {"key": "onClick", "value": "handleClick"}
                ],
                "children": [
                  {"type": "Text", "value": "Click me"}
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "script": {
    "type": "Script",
    "events": [
      {"key": "onLoad", "value": "init"},
      {"key": "onClick", "value": "handleClick"}
    ]
  }
}
```

## Edge Cases

- location 정보 누락 시 AST 생성 실패
- 빈 children 배열 대신 null 사용 시 validation 오류
- 허용되지 않은 meta/style/script 키 사용 시 semantic 오류
- LayoutComponent의 tag가 유효하지 않은 경우 오류
- LayoutText에 빈 문자열 사용 시 경고
- 중첩 깊이가 너무 깊을 경우 (10레벨 초과) 경고 또는 오류

## Version

- Version: 1.0.0
- Last Update: 2025-11-18
- Change Summary: Initial creation of UIH DSL AST Schema Definition.
