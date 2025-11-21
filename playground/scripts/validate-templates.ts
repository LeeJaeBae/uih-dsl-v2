import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";

const templates = [
  {
    id: "landing-saas",
    code: `meta {
  title: "Future SaaS"
  description: "The future of software"
}

style {
  color.bg: "#0f172a"
  color.primary: "#6366f1"
  color.text: "#f8fafc"
  color.textMuted: "#94a3b8"
  color.border: "#1e293b"
}

layout {
  Div(style: "background-color: color.bg; min-height: 100vh; color: color.text; font-family: sans-serif") {
    
    // Navbar
    Div(style: "border-bottom: 1px solid color.border; padding: 20px; display: flex; justify-content: space-between; align-items: center") {
      H3 { "Logo" }
      Div(style: "display: flex; gap: 20px") {
        Span(style: "color: color.textMuted; cursor: pointer") { "Features" }
        Span(style: "color: color.textMuted; cursor: pointer") { "Pricing" }
        Button(style: "background-color: color.primary; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer") {
          "Get Started"
        }
      }
    }

    // Hero
    Div(style: "max-width: 800px; margin: 0 auto; padding: 100px 20px; text-align: center") {
      H1(style: "font-size: 64px; background: linear-gradient(to right, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 20px") {
        "Build faster with AI"
      }
      P(style: "font-size: 20px; color: color.textMuted; line-height: 1.6; margin-bottom: 40px") {
        "Stop wrestling with complex code. Describe your dream UI and let our advanced AI engine build it for you in seconds."
      }
      Div(style: "display: flex; gap: 16px; justify-content: center") {
        Button(style: "background-color: color.primary; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer") {
          "Start Building Now"
        }
        Button(style: "background-color: transparent; color: color.text; border: 1px solid color.border; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer") {
          "View Documentation"
        }
      }
    }
  }
}`
  },
  {
    id: "dashboard-analytics",
    code: `meta {
  title: "Analytics"
}

style {
  color.bg: "#f3f4f6"
  color.card: "#ffffff"
  color.primary: "#3b82f6"
  color.text: "#111827"
  spacing.card: "24px"
  radius.lg: "12px"
}

layout {
  Div(style: "display: flex; min-height: 100vh; background-color: color.bg; font-family: sans-serif; color: color.text") {
    
    // Sidebar
    Div(style: "width: 250px; background-color: color.card; padding: 20px; border-right: 1px solid #e5e7eb") {
      H3(style: "margin-bottom: 40px") { "Dashboard" }
      Div(style: "display: flex; flex-direction: column; gap: 10px") {
        Div(style: "padding: 10px; background-color: #eff6ff; color: color.primary; border-radius: 6px") { "Overview" }
        Div(style: "padding: 10px; color: #6b7280") { "Reports" }
        Div(style: "padding: 10px; color: #6b7280") { "Settings" }
      }
    }

    // Main Content
    Div(style: "flex: 1; padding: 40px") {
      
      Div(style: "display: flex; justify-content: space-between; margin-bottom: 30px") {
        H2 { "Overview" }
        Button(style: "background-color: color.primary; color: white; border: none; padding: 8px 16px; border-radius: 6px") {
          "Export Data"
        }
      }

      // Stats Grid
      Div(style: "display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 24px") {
        
        Div(style: "background-color: color.card; padding: spacing.card; border-radius: radius.lg; box-shadow: 0 1px 3px rgba(0,0,0,0.1)") {
          P(style: "color: #6b7280; font-size: 14px") { "Total Revenue" }
          H3(style: "font-size: 28px; margin-top: 8px") { "$45,231" }
          Span(style: "color: #10b981; font-size: 14px") { "+20.1% from last month" }
        }
        
        Div(style: "background-color: color.card; padding: spacing.card; border-radius: radius.lg; box-shadow: 0 1px 3px rgba(0,0,0,0.1)") {
          P(style: "color: #6b7280; font-size: 14px") { "Active Users" }
          H3(style: "font-size: 28px; margin-top: 8px") { "2,345" }
          Span(style: "color: #10b981; font-size: 14px") { "+15% from last month" }
        }

        Div(style: "background-color: color.card; padding: spacing.card; border-radius: radius.lg; box-shadow: 0 1px 3px rgba(0,0,0,0.1)") {
          P(style: "color: #6b7280; font-size: 14px") { "Bounce Rate" }
          H3(style: "font-size: 28px; margin-top: 8px") { "42.3%" }
          Span(style: "color: #ef4444; font-size: 14px") { "-2% from last month" }
        }
      }

      // Chart Area
      Div(style: "background-color: color.card; padding: spacing.card; border-radius: radius.lg; height: 400px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; color: #9ca3af; border: 2px dashed #e5e7eb") {
        "Chart Placeholder Area"
      }
    }
  }
}`
  },
  {
    id: "mobile-profile",
    code: `meta {
  title: "Profile"
}

style {
  color.bg: "#ffffff"
  color.text: "#000000"
  color.gray: "#f4f4f5"
}

layout {
  Div(style: "max-width: 390px; margin: 0 auto; border: 1px solid #e5e5e5; height: 844px; border-radius: 40px; overflow: hidden; font-family: sans-serif; position: relative") {
    
    // Header Image
    Div(style: "height: 200px; background-color: #a1a1aa; background-image: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)") {}

    // Profile Content
    Div(style: "padding: 0 24px; margin-top: -50px") {
      
      // Avatar
      Div(style: "width: 100px; height: 100px; border-radius: 50%; background-color: white; border: 4px solid white; display: flex; align-items: center; justify-content: center; font-size: 40px; background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)") {
        "🦁"
      }

      H2(style: "margin: 16px 0 4px") { "Alex Designer" }
      P(style: "color: #71717a; margin: 0 0 24px") { "Product Designer @ UIH" }

      Div(style: "display: flex; gap: 12px; margin-bottom: 32px") {
        Button(style: "flex: 1; background-color: #18181b; color: white; border: none; padding: 12px; border-radius: 24px; font-weight: 600") {
          "Follow"
        }
        Button(style: "width: 48px; height: 48px; border-radius: 50%; border: 1px solid #e4e4e7; background: white; display: flex; align-items: center; justify-content: center") {
          "✉️"
        }
      }

      // Menu List
      Div(style: "display: flex; flex-direction: column; gap: 8px") {
        
        Div(style: "padding: 16px; background-color: color.gray; border-radius: 16px; display: flex; justify-content: space-between") {
          "My Projects"
          Span { "→" }
        }
        Div(style: "padding: 16px; background-color: color.gray; border-radius: 16px; display: flex; justify-content: space-between") {
          "Saved Templates"
          Span { "→" }
        }
        Div(style: "padding: 16px; background-color: color.gray; border-radius: 16px; display: flex; justify-content: space-between") {
          "Settings"
          Span { "→" }
        }
      }
    }
  }
}`
  }
];

console.log("Validating templates...");

templates.forEach((template) => {
  console.log(`\nTesting template: ${template.id}`);
  try {
    const tokens = tokenize(template.code);
    const result = parse(tokens);
    
    if (result.errors.length > 0) {
      console.error("❌ Validation failed:");
      result.errors.forEach((err) => {
        console.error(`  - Line ${err.line}, Col ${err.column}: ${err.message}`);
      });
    } else {
      console.log("✅ Validation passed");
    }
  } catch (e: any) {
    console.error("❌ Unexpected error:", e.message);
  }
});