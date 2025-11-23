import * as vscode from 'vscode';

// List of UIH DSL Tags
const UIH_TAGS = [
    // Layout
    'Div', 'Section', 'Article', 'Aside', 'Header', 'Footer', 'Nav', 'Main',
    // Text
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'Span', 'Text',
    // Form
    'Form', 'Input', 'Textarea', 'Button', 'Label', 'Select', 'Option',
    'Fieldset', 'Legend', 'Datalist', 'Optgroup', 'Meter', 'Progress',
    // List
    'Ul', 'Ol', 'Li',
    // Table
    'Table', 'Thead', 'Tbody', 'Tr', 'Td', 'Th',
    // Media
    'Img', 'Image', 'Video', 'Audio', 'Iframe', 'Canvas',
    // Semantic & Interactive
    'Address', 'Dialog', 'Figure', 'Figcaption', 'Details', 'Summary', 
    'Menu', 'Time', 'Mark', 'Blockquote', 'Code', 'Pre',
    // SVG
    'Svg', 'Path', 'Circle', 'Rect', 'Line', 'Polyline', 'Polygon', 
    'G', 'Defs', 'LinearGradient', 'Stop',
    // Other
    'A', 'Card', 'CardContent', 'Hr', 'Br'
];

// List of Common Attributes
const UIH_ATTRIBUTES = [
    'id', 'class', 'style', 'key',
    'if', 'for', 'each', // Control flow
    'onclick', 'onchange', 'onsubmit', 'oninput', // Events
    'href', 'src', 'alt', 'type', 'value', 'placeholder', 'name', // HTML basics
    'width', 'height', 'rows', 'cols',
    'checked', 'disabled', 'readonly', 'required', 'selected', 'hidden', // Booleans
    'aria-label', 'role'
];

// Snippets for structure
const SNIPPETS = {
    'layout': 'layout {\n\t$0\n}',
    'style': 'style {\n\t$0\n}',
    'meta': 'meta {\n\t$0\n}',
    'script': 'script {\n\t$0\n}',
    'component': 'component $1 {\n\t$0\n}'
};

export class UIHCompletionItemProvider implements vscode.CompletionItemProvider {

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        
        // 1. Check if we are typing a top-level block or tag (basic indentation or root)
        // Heuristic: starts with whitespace and characters
        if (/^\s*[a-zA-Z]*$/.test(linePrefix)) {
            return this.getTopLevelCompletions();
        }

        // 2. Check if we are inside component attributes: Tag(attr: "val", ...)
        // Look for opening parenthesis that hasn't been closed
        // This is a simple heuristic: check if last unclosed paren is '('
        if (this.isInsideAttributes(linePrefix)) {
             // Check if we are typing a value (after :)
             if (/:\s*"?$/.test(linePrefix) || /:\s*"[^"]*$/.test(linePrefix)) {
                 // Typing value, maybe suggest variables? For now return empty
                 return undefined;
             }
             return this.getAttributeCompletions();
        }

        return undefined;
    }

    private isInsideAttributes(text: string): boolean {
        let depth = 0;
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '(') depth++;
            else if (text[i] === ')') depth--;
        }
        return depth > 0;
    }

    private getTopLevelCompletions(): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];

        // Keywords
        Object.entries(SNIPPETS).forEach(([label, snippet]) => {
            const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Keyword);
            item.insertText = new vscode.SnippetString(snippet);
            items.push(item);
        });

        // Tags
        UIH_TAGS.forEach(tag => {
            const item = new vscode.CompletionItem(tag, vscode.CompletionItemKind.Class);
            item.insertText = new vscode.SnippetString(`${tag}($1) {\n\t$0\n}`);
            item.detail = "UIH Component";
            items.push(item);
        });

        return items;
    }

    private getAttributeCompletions(): vscode.CompletionItem[] {
        return UIH_ATTRIBUTES.map(attr => {
            const item = new vscode.CompletionItem(attr, vscode.CompletionItemKind.Property);
            item.insertText = new vscode.SnippetString(`${attr}:"$1"`);
            return item;
        });
    }
}
