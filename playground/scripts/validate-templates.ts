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
  },
  {
    id: "dark-modern-dashboard",
    code: `meta {
  title: "Nexus Dashboard"
  description: "Futuristic dark dashboard"
}

style {
  color.bg: "#09090b"
  color.surface: "#18181b"
  color.surfaceHighlight: "#27272a"
  color.border: "#27272a"
  color.primary: "#8b5cf6"
  color.primaryGlow: "rgba(139, 92, 246, 0.5)"
  color.text: "#f4f4f5"
  color.textMuted: "#71717a"
  color.success: "#10b981"
  
  radius.lg: "16px"
  radius.xl: "24px"
  radius.full: "9999px"
  
  spacing.sm: "8px"
  spacing.md: "16px"
  spacing.lg: "24px"
}

layout {
  Div(style: "display: flex; min-height: 100vh; background-color: color.bg; color: color.text; font-family: sans-serif; overflow: hidden") {
    
    // Glass Sidebar
    Div(style: "width: 280px; background-color: rgba(24, 24, 27, 0.6); backdrop-filter: blur(20px); border-right: 1px solid color.border; display: flex; flex-direction: column; padding: spacing.lg; z-index: 10") {
      // Logo
      Div(style: "display: flex; items-center: center; gap: spacing.sm; margin-bottom: 40px") {
        Div(style: "width: 32px; height: 32px; background-color: color.primary; border-radius: 8px; box-shadow: 0 0 15px color.primaryGlow") {}
        H3(style: "font-size: 20px; font-weight: 700; margin: 0; letter-spacing: -0.5px") { "NEXUS" }
      }
      
      // Navigation
      Div(style: "display: flex; flex-direction: column; gap: 8px") {
        Button(style: "text-align: left; padding: 12px 16px; background-color: color.surfaceHighlight; color: white; border: 1px solid rgba(255,255,255,0.1); border-radius: radius.lg; font-weight: 500; font-size: 14px; cursor: pointer; display: flex; items-center: center; gap: 12px") { 
          Span { "📊" }
          Span { "Dashboard" }
        }
        Button(style: "text-align: left; padding: 12px 16px; background-color: transparent; color: color.textMuted; border: none; border-radius: radius.lg; font-weight: 500; font-size: 14px; cursor: pointer; display: flex; items-center: center; gap: 12px") { 
          Span { "⚡️" }
          Span { "Activity" }
        }
        Button(style: "text-align: left; padding: 12px 16px; background-color: transparent; color: color.textMuted; border: none; border-radius: radius.lg; font-weight: 500; font-size: 14px; cursor: pointer; display: flex; items-center: center; gap: 12px") { 
          Span { "💳" }
          Span { "Wallet" }
        }
        Button(style: "text-align: left; padding: 12px 16px; background-color: transparent; color: color.textMuted; border: none; border-radius: radius.lg; font-weight: 500; font-size: 14px; cursor: pointer; display: flex; items-center: center; gap: 12px") { 
          Span { "⚙️" }
          Span { "Settings" }
        }
      }
      
      // User Profile
      Div(style: "margin-top: auto; background-color: color.surface; padding: 12px; border-radius: radius.lg; border: 1px solid color.border; display: flex; items-center: center; gap: 12px") {
        Div(style: "width: 36px; height: 36px; border-radius: radius.full; background-image: linear-gradient(135deg, #8b5cf6, #ec4899)") {}
        Div {
          Div(style: "font-size: 13px; font-weight: 600") { "Alex Morgan" }
          Div(style: "font-size: 11px; color: color.textMuted") { "Pro Plan" }
        }
      }
    }

    // Main Content
    Div(style: "flex: 1; display: flex; flex-direction: column; position: relative") {
      // Background decorative gradients
      Div(style: "position: absolute; top: -10%; right: -5%; width: 500px; height: 500px; background-color: color.primary; opacity: 0.05; filter: blur(100px); border-radius: radius.full; pointer-events: none") {}
      
      // Header
      Div(style: "height: 80px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px") {
        Div {
          H2(style: "font-size: 24px; font-weight: 700; margin: 0") { "Overview" }
          P(style: "font-size: 14px; color: color.textMuted; margin: 4px 0 0") { "Welcome back to your command center." }
        }
        Div(style: "display: flex; gap: 12px") {
          Button(style: "width: 40px; height: 40px; border-radius: radius.full; border: 1px solid color.border; background-color: color.surface; color: color.text; cursor: pointer; display: flex; align-items: center; justify-content: center") { "🔔" }
          Button(style: "padding: 0 20px; height: 40px; background-color: color.text; color: color.bg; border: none; border-radius: radius.full; font-weight: 600; font-size: 14px; cursor: pointer") { "+ Add Widget" }
        }
      }

      // Scroll Area
      Div(style: "flex: 1; padding: 0 40px 40px; overflow-y: auto") {
        
        // Stats Cards
        Div(style: "display: grid; grid-template-columns: repeat(3, 1fr); gap: spacing.lg; margin-bottom: spacing.lg") {
          // Card 1
          Div(style: "background-color: color.surface; border: 1px solid color.border; padding: 24px; border-radius: radius.xl; position: relative; overflow: hidden") {
            Div(style: "position: absolute; top: 0; right: 0; padding: 20px; opacity: 0.1; font-size: 40px") { "📈" }
            Div(style: "color: color.textMuted; font-size: 14px; font-weight: 500; margin-bottom: 8px") { "Total Revenue" }
            Div(style: "font-size: 32px; font-weight: 800; letter-spacing: -1px") { "$124,500" }
            Div(style: "display: flex; items-center: center; gap: 6px; margin-top: 12px") {
              Span(style: "background-color: rgba(16, 185, 129, 0.15); color: color.success; padding: 4px 8px; border-radius: 20px; font-size: 12px; font-weight: 600") { "+12.5%" }
              Span(style: "color: color.textMuted; font-size: 12px") { "vs last month" }
            }
          }
          // Card 2
          Div(style: "background-color: color.surface; border: 1px solid color.border; padding: 24px; border-radius: radius.xl") {
            Div(style: "color: color.textMuted; font-size: 14px; font-weight: 500; margin-bottom: 8px") { "Active Users" }
            Div(style: "font-size: 32px; font-weight: 800; letter-spacing: -1px") { "8,249" }
            Div(style: "display: flex; items-center: center; gap: 6px; margin-top: 12px") {
              Span(style: "background-color: rgba(16, 185, 129, 0.15); color: color.success; padding: 4px 8px; border-radius: 20px; font-size: 12px; font-weight: 600") { "+5.2%" }
              Span(style: "color: color.textMuted; font-size: 12px") { "vs last month" }
            }
          }
          // Card 3 (Gradient)
          Div(style: "background-color: color.primary; padding: 24px; border-radius: radius.xl; color: white; background-image: linear-gradient(135deg, #8b5cf6, #6366f1)") {
            Div(style: "font-size: 14px; font-weight: 500; margin-bottom: 8px; opacity: 0.8") { "Pro Subscription" }
            Div(style: "font-size: 28px; font-weight: 800; margin-bottom: 20px") { "Active" }
            Button(style: "width: 100%; padding: 10px; background-color: rgba(255,255,255,0.2); border: none; border-radius: 12px; color: white; font-weight: 600; cursor: pointer; backdrop-filter: blur(10px)") { "Manage Plan" }
          }
        }

        // Bento Grid
        Div(style: "display: grid; grid-template-columns: 2fr 1fr; gap: spacing.lg") {
          
          // Large Chart Area
          Div(style: "background-color: color.surface; border: 1px solid color.border; border-radius: radius.xl; padding: 32px") {
            Div(style: "display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px") {
              H3(style: "margin: 0; font-size: 18px; font-weight: 600") { "Revenue Analytics" }
              Div(style: "display: flex; gap: 8px") {
                Button(style: "padding: 6px 12px; background-color: color.surfaceHighlight; border: none; border-radius: 8px; color: color.text; font-size: 12px; cursor: pointer") { "7D" }
                Button(style: "padding: 6px 12px; background-color: transparent; border: none; border-radius: 8px; color: color.textMuted; font-size: 12px; cursor: pointer") { "1M" }
              }
            }
            
            // Fake Chart
            Div(style: "display: flex; items-end: flex-end; height: 200px; gap: 16px; padding-bottom: 10px; border-bottom: 1px solid color.border") {
              Div(style: "flex: 1; background-color: color.surfaceHighlight; height: 40%; border-radius: 8px 8px 0 0") {}
              Div(style: "flex: 1; background-color: color.surfaceHighlight; height: 60%; border-radius: 8px 8px 0 0") {}
              Div(style: "flex: 1; background-color: color.primary; height: 85%; border-radius: 8px 8px 0 0; box-shadow: 0 0 20px color.primaryGlow") {}
              Div(style: "flex: 1; background-color: color.surfaceHighlight; height: 50%; border-radius: 8px 8px 0 0") {}
              Div(style: "flex: 1; background-color: color.surfaceHighlight; height: 65%; border-radius: 8px 8px 0 0") {}
              Div(style: "flex: 1; background-color: color.surfaceHighlight; height: 75%; border-radius: 8px 8px 0 0") {}
              Div(style: "flex: 1; background-color: color.surfaceHighlight; height: 55%; border-radius: 8px 8px 0 0") {}
            }
          }

          // Right Column (Transactions)
          Div(style: "background-color: color.surface; border: 1px solid color.border; border-radius: radius.xl; padding: 24px") {
            H3(style: "margin: 0 0 20px 0; font-size: 18px; font-weight: 600") { "Recent Transactions" }
            
            Div(style: "display: flex; flex-direction: column; gap: 16px") {
              // Item 1
              Div(style: "display: flex; align-items: center; justify-content: space-between") {
                Div(style: "display: flex; align-items: center; gap: 12px") {
                  Div(style: "width: 40px; height: 40px; border-radius: 12px; background-color: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 20px") { "🍎" }
                  Div {
                    Div(style: "font-weight: 500; font-size: 14px") { "Apple Store" }
                    Div(style: "font-size: 12px; color: color.textMuted") { "Electronics" }
                  }
                }
                Div(style: "font-weight: 600; font-size: 14px") { "-$999" }
              }
              // Item 2
              Div(style: "display: flex; align-items: center; justify-content: space-between") {
                Div(style: "display: flex; align-items: center; gap: 12px") {
                  Div(style: "width: 40px; height: 40px; border-radius: 12px; background-color: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 20px") { "🍟" }
                  Div {
                    Div(style: "font-weight: 500; font-size: 14px") { "Uber Eats" }
                    Div(style: "font-size: 12px; color: color.textMuted") { "Food" }
                  }
                }
                Div(style: "font-weight: 600; font-size: 14px") { "-$32.50" }
              }
            }
            
            Button(style: "width: 100%; padding: 12px; margin-top: 24px; background-color: transparent; border: 1px solid color.border; border-radius: 12px; color: color.text; font-size: 13px; font-weight: 500; cursor: pointer") { "View All History" }
          }
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