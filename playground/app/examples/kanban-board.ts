export const KANBAN_BOARD = `meta {
  title: "Kanban Board"
  route: "/kanban"
}

style {
  color.bg.board: "#F3F4F6"
  color.bg.column: "#E5E7EB"
  color.bg.card: "#FFFFFF"
  color.text.primary: "#1F2937"
  color.text.secondary: "#6B7280"
  color.border: "#D1D5DB"
  color.tag.design: "#DBEAFE"
  color.tag.design.text: "#1E40AF"
  color.tag.bug: "#FEE2E2"
  color.tag.bug.text: "#991B1B"
  color.tag.feature: "#D1FAE5"
  color.tag.feature.text: "#065F46"
  spacing.sm: "8px"
  spacing.md: "12px"
  spacing.lg: "16px"
  radius.md: "6px"
  radius.lg: "8px"
  shadow.sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
  font.weight.bold: "600"
  font.weight.medium: "500"
}

components {
  Board
  Column
  TaskCard
  Tag
  Avatar
}

layout {
  Div(class: "board-container", style: "min-height: 100vh; background: var(--color-bg-board); padding: var(--spacing-lg); overflow-x: auto") {
    Header(style: "margin-bottom: var(--spacing-lg); display: flex; justify-content: space-between; align-items: center") {
      H1(style: "font-size: 24px; font-weight: var(--font-weight-bold); color: var(--color-text-primary)") {
        "Project Roadmap"
      }
      Div(class: "avatars", style: "display: flex; gap: -8px") {
        Avatar(style: "width: 32px; height: 32px; background: #3B82F6; border-radius: 50%; border: 2px solid white") { "" }
        Avatar(style: "width: 32px; height: 32px; background: #10B981; border-radius: 50%; border: 2px solid white; margin-left: -8px") { "" }
        Avatar(style: "width: 32px; height: 32px; background: #F59E0B; border-radius: 50%; border: 2px solid white; margin-left: -8px") { "" }
      }
    }
    
    Board(class: "kanban-board", style: "display: flex; gap: var(--spacing-lg); align-items: flex-start") {
      
      Column(class: "column", style: "width: 300px; background: var(--color-bg-column); padding: var(--spacing-md); border-radius: var(--radius-lg); flex-shrink: 0") {
        Div(class: "col-header", style: "display: flex; justify-content: space-between; margin-bottom: var(--spacing-md)") {
          H3(style: "font-size: 14px; font-weight: var(--font-weight-bold); color: var(--color-text-secondary)") { "TO DO" }
          Span(style: "font-size: 12px; background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 10px") { "3" }
        }
        
        TaskCard(style: "background: var(--color-bg-card); padding: var(--spacing-md); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); margin-bottom: var(--spacing-sm)") {
          Tag(style: "display: inline-block; font-size: 10px; padding: 2px 8px; border-radius: 4px; background: var(--color-tag-design); color: var(--color-tag-design-text); margin-bottom: var(--spacing-sm)") { "Design" }
          P(style: "font-size: 14px; font-weight: var(--font-weight-medium); color: var(--color-text-primary); margin-bottom: var(--spacing-sm)") {
            "Create new landing page mockups"
          }
          Div(style: "display: flex; justify-content: flex-end") {
            Avatar(style: "width: 24px; height: 24px; background: #3B82F6; border-radius: 50%") { "" }
          }
        }

        TaskCard(style: "background: var(--color-bg-card); padding: var(--spacing-md); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); margin-bottom: var(--spacing-sm)") {
          Tag(style: "display: inline-block; font-size: 10px; padding: 2px 8px; border-radius: 4px; background: var(--color-tag-feature); color: var(--color-tag-feature-text); margin-bottom: var(--spacing-sm)") { "Feature" }
          P(style: "font-size: 14px; font-weight: var(--font-weight-medium); color: var(--color-text-primary); margin-bottom: var(--spacing-sm)") {
            "Implement OAuth login"
          }
          Div(style: "display: flex; justify-content: flex-end") {
            Avatar(style: "width: 24px; height: 24px; background: #10B981; border-radius: 50%") { "" }
          }
        }
      }

      Column(class: "column", style: "width: 300px; background: var(--color-bg-column); padding: var(--spacing-md); border-radius: var(--radius-lg); flex-shrink: 0") {
        Div(class: "col-header", style: "display: flex; justify-content: space-between; margin-bottom: var(--spacing-md)") {
          H3(style: "font-size: 14px; font-weight: var(--font-weight-bold); color: var(--color-text-secondary)") { "IN PROGRESS" }
          Span(style: "font-size: 12px; background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 10px") { "1" }
        }
        
        TaskCard(style: "background: var(--color-bg-card); padding: var(--spacing-md); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); margin-bottom: var(--spacing-sm)") {
          Tag(style: "display: inline-block; font-size: 10px; padding: 2px 8px; border-radius: 4px; background: var(--color-tag-bug); color: var(--color-tag-bug-text); margin-bottom: var(--spacing-sm)") { "Bug" }
          P(style: "font-size: 14px; font-weight: var(--font-weight-medium); color: var(--color-text-primary); margin-bottom: var(--spacing-sm)") {
            "Fix navigation z-index issue"
          }
          Div(style: "display: flex; justify-content: flex-end") {
            Avatar(style: "width: 24px; height: 24px; background: #F59E0B; border-radius: 50%") { "" }
          }
        }
      }

      Column(class: "column", style: "width: 300px; background: var(--color-bg-column); padding: var(--spacing-md); border-radius: var(--radius-lg); flex-shrink: 0") {
        Div(class: "col-header", style: "display: flex; justify-content: space-between; margin-bottom: var(--spacing-md)") {
          H3(style: "font-size: 14px; font-weight: var(--font-weight-bold); color: var(--color-text-secondary)") { "DONE" }
          Span(style: "font-size: 12px; background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 10px") { "2" }
        }
        
        TaskCard(style: "background: var(--color-bg-card); padding: var(--spacing-md); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); margin-bottom: var(--spacing-sm)") {
          Tag(style: "display: inline-block; font-size: 10px; padding: 2px 8px; border-radius: 4px; background: var(--color-tag-feature); color: var(--color-tag-feature-text); margin-bottom: var(--spacing-sm)") { "Feature" }
          P(style: "font-size: 14px; font-weight: var(--font-weight-medium); color: var(--color-text-primary); margin-bottom: var(--spacing-sm); text-decoration: line-through; color: var(--color-text-secondary)") {
            "Setup project repo"
          }
        }
      }
    }
  }
}`;
