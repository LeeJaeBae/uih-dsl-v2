import { motion } from "framer-motion";

const TEMPLATES = [
  {
    id: "landing-saas",
    title: "SaaS Landing",
    description: "Modern dark-themed landing page with hero, features, and CTA.",
    category: "Landing Page",
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
    title: "Analytics Dashboard",
    description: "Grid layout with sidebar, stats cards, and charts area.",
    category: "Dashboard",
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
    title: "Mobile Profile",
    description: "Clean mobile-first profile page with avatar and list.",
    category: "Mobile",
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
    title: "Nexus Dashboard",
    description: "Futuristic dark-mode dashboard with glassmorphism, glow effects, and modern bento-grid layout.",
    category: "Showcase",
    code: `meta {
  title: "Nexus Dashboard"
  description: "Futuristic dark dashboard"
}

style {
  color.bg: "#09090b"
  color.surface: "rgba(24, 24, 27, 0.8)"
  color.surfaceHighlight: "rgba(63, 63, 70, 0.4)"
  color.border: "rgba(255, 255, 255, 0.08)"
  color.primary: "#7c3aed"
  color.primaryGlow: "rgba(124, 58, 237, 0.5)"
  color.text: "#fafafa"
  color.textMuted: "#a1a1aa"
  color.success: "#10b981"
  
  radius.lg: "16px"
  radius.xl: "24px"
  radius.full: "9999px"
  
  spacing.sm: "8px"
  spacing.md: "16px"
  spacing.lg: "32px"
  spacing.xl: "48px"
  
  shadow.glow: "0 0 40px rgba(124, 58, 237, 0.15)"
}

layout {
  Div(style: "display: flex; min-height: 100vh; background-color: color.bg; color: color.text; font-family: 'Inter', system-ui, sans-serif; overflow: hidden") {
    
    // Glass Sidebar
    Div(if: "isSidebarOpen" style: "width: 300px; background-color: rgba(9, 9, 11, 0.6); backdrop-filter: blur(40px); border-right: 1px solid color.border; display: flex; flex-direction: column; padding: spacing.lg; z-index: 20") {
      // Logo
      Div(style: "display: flex; items-center: center; gap: spacing.md; margin-bottom: 60px; padding-left: 8px") {
        Div(style: "width: 40px; height: 40px; background-image: linear-gradient(135deg, color.primary, #c084fc); border-radius: 12px; box-shadow: 0 0 20px color.primaryGlow; display: flex; align-items: center; justify-content: center") {
           // Simple geometric logo shape
           Div(style: "width: 20px; height: 20px; border: 3px solid white; border-radius: 6px") {}
        }
        H3(style: "font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px; background: linear-gradient(to right, #fff, #a1a1aa); -webkit-background-clip: text; -webkit-text-fill-color: transparent") { "NEXUS" }
      }
      
      // Navigation
      Div(style: "display: flex; flex-direction: column; gap: 12px") {
        Button(style: "text-align: left; padding: 16px 20px; background-color: color.surfaceHighlight; color: white; border: 1px solid rgba(255,255,255,0.1); border-radius: radius.lg; font-weight: 600; font-size: 15px; cursor: pointer; display: flex; items-center: center; gap: 16px; transition: all 0.2s; box-shadow: 0 4px 20px rgba(0,0,0,0.2)") { 
          // Icon: Grid
          Svg(width:"20" height:"20" viewBox:"0 0 24 24" fill:"none" stroke:"currentColor" stroke-width:"2" stroke-linecap:"round" stroke-linejoin:"round") {
            Path(d:"M3 3h7v7H3z")
            Path(d:"M14 3h7v7h-7z")
            Path(d:"M14 14h7v7h-7z")
            Path(d:"M3 14h7v7H3z")
          }
          Span { "Dashboard" }
        }
        
        Button(style: "text-align: left; padding: 16px 20px; background-color: transparent; color: color.textMuted; border: 1px solid transparent; border-radius: radius.lg; font-weight: 500; font-size: 15px; cursor: pointer; display: flex; items-center: center; gap: 16px; transition: all 0.2s; hover: { background-color: rgba(255,255,255,0.03); color: white }") { 
          // Icon: Activity
          Svg(width:"20" height:"20" viewBox:"0 0 24 24" fill:"none" stroke:"currentColor" stroke-width:"2" stroke-linecap:"round" stroke-linejoin:"round") {
            Polyline(points:"22 12 18 12 15 21 9 3 6 12 2 12")
          }
          Span { "Activity" }
        }
        
        Button(style: "text-align: left; padding: 16px 20px; background-color: transparent; color: color.textMuted; border: 1px solid transparent; border-radius: radius.lg; font-weight: 500; font-size: 15px; cursor: pointer; display: flex; items-center: center; gap: 16px; transition: all 0.2s; hover: { background-color: rgba(255,255,255,0.03); color: white }") { 
          // Icon: Wallet
          Svg(width:"20" height:"20" viewBox:"0 0 24 24" fill:"none" stroke:"currentColor" stroke-width:"2" stroke-linecap:"round" stroke-linejoin:"round") {
            Rect(x:"1" y:"4" width:"22" height:"16" rx:"2" ry:"2")
            Line(x1:"1" y1:"10" x2:"23" y2:"10")
          }
          Span { "Wallet" }
        }
        
        Button(style: "text-align: left; padding: 16px 20px; background-color: transparent; color: color.textMuted; border: 1px solid transparent; border-radius: radius.lg; font-weight: 500; font-size: 15px; cursor: pointer; display: flex; items-center: center; gap: 16px; transition: all 0.2s; hover: { background-color: rgba(255,255,255,0.03); color: white }") { 
          // Icon: Settings
          Svg(width:"20" height:"20" viewBox:"0 0 24 24" fill:"none" stroke:"currentColor" stroke-width:"2" stroke-linecap:"round" stroke-linejoin:"round") {
            Path(d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z")
            Circle(cx:"12" cy:"12" r:"3")
          }
          Span { "Settings" }
        }
      }
      
      // User Profile
      Div(style: "margin-top: auto; background-color: rgba(255,255,255,0.03); padding: 16px; border-radius: radius.lg; border: 1px solid color.border; display: flex; items-center: center; gap: 16px; backdrop-filter: blur(10px)") {
        Div(style: "width: 44px; height: 44px; border-radius: 14px; background-image: linear-gradient(135deg, #8b5cf6, #ec4899); box-shadow: 0 4px 12px rgba(0,0,0,0.3)") {}
        Div {
          Div(style: "font-size: 14px; font-weight: 600; color: white") { "Alex Morgan" }
          Div(style: "font-size: 12px; color: color.textMuted; margin-top: 2px") { "Pro Plan" }
        }
      }
    }

    // Main Content
    Div(style: "flex: 1; display: flex; flex-direction: column; position: relative; background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #09090b 60%)") {
      
      // Header
      Div(style: "height: 100px; display: flex; align-items: center; justify-content: space-between; padding: 0 spacing.xl; border-bottom: 1px solid color.border; background: rgba(9,9,11,0.4); backdrop-filter: blur(10px); z-index: 10") {
        Div(style: "display: flex; align-items: center; gap: 16px") {
          // Toggle Button
          Button(onClick: "toggle(isSidebarOpen)" style: "padding: 8px; background: transparent; border: 1px solid color.border; border-radius: 8px; color: color.textMuted; cursor: pointer; hover: { color: white; background: color.surfaceHighlight }") {
            Svg(width:"20" height:"20" viewBox:"0 0 24 24" fill:"none" stroke:"currentColor" stroke-width:"2" stroke-linecap:"round" stroke-linejoin:"round") {
              Line(x1:"3" y1:"12" x2:"21" y2:"12")
              Line(x1:"3" y1:"6" x2:"21" y2:"6")
              Line(x1:"3" y1:"18" x2:"21" y2:"18")
            }
          }
          Div {
            H2(style: "font-size: 32px; font-weight: 800; margin: 0; letter-spacing: -1px; color: white") { "Overview" }
            P(style: "font-size: 15px; color: color.textMuted; margin: 6px 0 0") { "Welcome back to your command center." }
          }
        }
        Div(style: "display: flex; gap: 16px") {
          Button(style: "width: 48px; height: 48px; border-radius: radius.full; border: 1px solid color.border; background-color: rgba(255,255,255,0.03); color: color.text; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s") { 
             // Bell Icon
             Div(style: "width: 8px; height: 8px; background: #ef4444; border-radius: 50%; position: absolute; top: 12px; right: 14px") {}
             Span { "🔔" } 
          }
          Button(style: "padding: 0 24px; height: 48px; background-color: white; color: black; border: none; border-radius: radius.full; font-weight: 700; font-size: 15px; cursor: pointer; box-shadow: 0 0 20px rgba(255,255,255,0.2); transition: transform 0.2s") { "+ Add Widget" }
        }
      }

      // Scroll Area
      Div(style: "flex: 1; padding: spacing.xl; overflow-y: auto") {
        
        // Stats Cards
        Div(style: "display: grid; grid-template-columns: repeat(3, 1fr); gap: spacing.lg; margin-bottom: spacing.lg") {
          // Card 1
          Div(style: "background-color: color.surface; border: 1px solid color.border; padding: 24px; border-radius: radius.xl; position: relative; overflow: hidden; box-shadow: shadow.glow; transition: transform 0.2s; hover: { transform: translateY(-4px) }") {
            Div(style: "position: absolute; top: 0; right: 0; width: 150px; height: 150px; background: linear-gradient(135deg, rgba(124,58,237,0.1), transparent); border-radius: 0 0 0 100%") {}
            
            Div(style: "color: color.textMuted; font-size: 15px; font-weight: 600; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; display: flex; justify-content: space-between") { 
              Span { "Total Revenue" }
              Svg(width:"20" height:"20" viewBox:"0 0 24 24" fill:"none" stroke:"currentColor" stroke-width:"2" stroke-linecap:"round" stroke-linejoin:"round") {
                Polyline(points:"23 6 13.5 15.5 8.5 10.5 1 18")
                Polyline(points:"17 6 23 6 23 12")
              }
            }
            Div(style: "font-size: 42px; font-weight: 800; letter-spacing: -2px; color: white") { "$124,500" }
            
            Div(style: "display: flex; items-center: center; gap: 8px; margin-top: 16px") {
              Span(style: "background-color: rgba(16, 185, 129, 0.2); color: color.success; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.2)") { "+12.5%" }
              Span(style: "color: color.textMuted; font-size: 13px") { "vs last month" }
            }
          }
          
          // Card 2
          Div(style: "background-color: color.surface; border: 1px solid color.border; padding: 32px; border-radius: radius.xl; transition: transform 0.2s; hover: { transform: translateY(-4px) }") {
            Div(style: "color: color.textMuted; font-size: 15px; font-weight: 600; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px") { "Active Users" }
            Div(style: "font-size: 42px; font-weight: 800; letter-spacing: -2px; color: white") { "8,249" }
            
            Div(style: "display: flex; items-center: center; gap: 8px; margin-top: 16px") {
              Span(style: "background-color: rgba(16, 185, 129, 0.2); color: color.success; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.2)") { "+5.2%" }
              Span(style: "color: color.textMuted; font-size: 13px") { "vs last month" }
            }
          }
          
          // Card 3 (Gradient)
          Div(style: "background-image: linear-gradient(135deg, #7c3aed, #db2777); padding: 32px; border-radius: radius.xl; color: white; box-shadow: 0 10px 40px rgba(124, 58, 237, 0.4); position: relative; overflow: hidden") {
            Div(style: "position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; border: 20px solid rgba(255,255,255,0.1); border-radius: 50%") {}
            
            Div(style: "font-size: 15px; font-weight: 600; margin-bottom: 12px; opacity: 0.9") { "Pro Subscription" }
            Div(style: "font-size: 36px; font-weight: 800; margin-bottom: 24px; letter-spacing: -1px") { "Active Plan" }
            Button(style: "width: 100%; padding: 14px; background-color: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 14px; color: white; font-weight: 700; cursor: pointer; backdrop-filter: blur(10px); transition: background 0.2s; font-size: 14px") { "Manage Subscription" }
          }
        }

        // Bento Grid
        Div(style: "display: grid; grid-template-columns: 2fr 1fr; gap: spacing.lg; height: 400px") {
          
          // Large Chart Area
          Div(style: "background-color: color.surface; border: 1px solid color.border; border-radius: radius.xl; padding: 32px; display: flex; flex-direction: column") {
            Div(style: "display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px") {
              H3(style: "margin: 0; font-size: 20px; font-weight: 700; color: white") { "Revenue Analytics" }
              Div(style: "display: flex; gap: 8px; background-color: rgba(0,0,0,0.3); padding: 4px; border-radius: 12px; border: 1px solid color.border") {
                Button(style: "padding: 8px 16px; background-color: color.surfaceHighlight; border: none; border-radius: 8px; color: white; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2)") { "7D" }
                Button(style: "padding: 8px 16px; background-color: transparent; border: none; border-radius: 8px; color: color.textMuted; font-size: 13px; font-weight: 600; cursor: pointer") { "1M" }
                Button(style: "padding: 8px 16px; background-color: transparent; border: none; border-radius: 8px; color: color.textMuted; font-size: 13px; font-weight: 600; cursor: pointer") { "1Y" }
              }
            }
            
            // Fake Chart Bars
            Div(style: "flex: 1; display: flex; items-end: flex-end; gap: 24px; padding-bottom: 10px; border-bottom: 1px solid color.border") {
              Div(style: "flex: 1; background: linear-gradient(to top, color.surfaceHighlight, rgba(255,255,255,0.1)); height: 40%; border-radius: 8px 8px 0 0") {}
              Div(style: "flex: 1; background: linear-gradient(to top, color.surfaceHighlight, rgba(255,255,255,0.1)); height: 60%; border-radius: 8px 8px 0 0") {}
              Div(style: "flex: 1; background: linear-gradient(to top, #7c3aed, #c084fc); height: 85%; border-radius: 8px 8px 0 0; box-shadow: 0 0 30px color.primaryGlow") {}
              Div(style: "flex: 1; background: linear-gradient(to top, color.surfaceHighlight, rgba(255,255,255,0.1)); height: 50%; border-radius: 8px 8px 0 0") {}
              Div(style: "flex: 1; background: linear-gradient(to top, color.surfaceHighlight, rgba(255,255,255,0.1)); height: 65%; border-radius: 8px 8px 0 0") {}
              Div(style: "flex: 1; background: linear-gradient(to top, color.surfaceHighlight, rgba(255,255,255,0.1)); height: 75%; border-radius: 8px 8px 0 0") {}
              Div(style: "flex: 1; background: linear-gradient(to top, color.surfaceHighlight, rgba(255,255,255,0.1)); height: 55%; border-radius: 8px 8px 0 0") {}
            }
          }

          // Right Column (Transactions)
          Div(style: "background-color: color.surface; border: 1px solid color.border; border-radius: radius.xl; padding: 32px; display: flex; flex-direction: column") {
            H3(style: "margin: 0 0 24px 0; font-size: 20px; font-weight: 700; color: white") { "Recent" }
            
            Div(style: "display: flex; flex-direction: column; gap: 20px; flex: 1") {
              // Item 1
              Div(style: "display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05)") {
                Div(style: "display: flex; align-items: center; gap: 16px") {
                  Div(style: "width: 48px; height: 48px; border-radius: 16px; background-color: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 24px") { "🍎" }
                  Div {
                    Div(style: "font-weight: 600; font-size: 15px; color: white") { "Apple Store" }
                    Div(style: "font-size: 13px; color: color.textMuted") { "Electronics" }
                  }
                }
                Div(style: "font-weight: 700; font-size: 15px; color: white") { "-$999" }
              }
              // Item 2
              Div(style: "display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05)") {
                Div(style: "display: flex; align-items: center; gap: 16px") {
                  Div(style: "width: 48px; height: 48px; border-radius: 16px; background-color: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 24px") { "🍟" }
                  Div {
                    Div(style: "font-weight: 600; font-size: 15px; color: white") { "Uber Eats" }
                    Div(style: "font-size: 13px; color: color.textMuted") { "Food" }
                  }
                }
                Div(style: "font-weight: 700; font-size: 15px; color: white") { "-$32.50" }
              }
            }
            
            Button(style: "width: 100%; padding: 16px; margin-top: auto; background-color: transparent; border: 1px solid color.border; border-radius: 16px; color: white; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; hover: { background-color: rgba(255,255,255,0.05) }") { "View All History" }
          }
        }
      }
    }
  }
}`
  }
];

interface TemplateGalleryProps {
  onSelect: (code: string) => void;
  onClose: () => void;
}

export function TemplateGallery({ onSelect, onClose }: TemplateGalleryProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-5xl h-[80vh] bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Start with a Template</h2>
            <p className="text-gray-400 mt-1">Kickstart your project with professionally designed UIH layouts.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ y: -4 }}
                className="group relative bg-gray-800 border border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:border-gray-600 transition-all"
                onClick={() => {
                  onSelect(template.code);
                  onClose();
                }}
              >
                {/* Preview Skeleton */}
                <div className="h-40 bg-gray-900 border-b border-gray-700 p-4 flex flex-col gap-2 group-hover:bg-gray-850 transition-colors">
                  <div className="w-1/3 h-2 bg-gray-700 rounded-full mb-2"></div>
                  <div className="w-full h-20 bg-gray-800 rounded-lg border border-gray-700/50"></div>
                  <div className="flex gap-2 mt-auto">
                    <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                    <div className="flex-1 h-2 bg-gray-700 rounded-full self-center"></div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {template.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}