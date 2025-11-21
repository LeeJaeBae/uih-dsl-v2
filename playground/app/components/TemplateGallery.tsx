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
  Div {
    style: "background-color: color.bg; min-height: 100vh; color: color.text; font-family: sans-serif"
    
    // Navbar
    Div {
      style: "border-bottom: 1px solid color.border; padding: 20px; display: flex; justify-content: space-between; align-items: center"
      H3 { "Logo" }
      Div {
        style: "display: flex; gap: 20px"
        Span { style: "color: color.textMuted; cursor: pointer" "Features" }
        Span { style: "color: color.textMuted; cursor: pointer" "Pricing" }
        Button {
          style: "background-color: color.primary; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer"
          "Get Started"
        }
      }
    }

    // Hero
    Div {
      style: "max-width: 800px; margin: 0 auto; padding: 100px 20px; text-align: center"
      H1 {
        style: "font-size: 64px; background: linear-gradient(to right, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 20px"
        "Build faster with AI"
      }
      P {
        style: "font-size: 20px; color: color.textMuted; line-height: 1.6; margin-bottom: 40px"
        "Stop wrestling with complex code. Describe your dream UI and let our advanced AI engine build it for you in seconds."
      }
      Div {
        style: "display: flex; gap: 16px; justify-content: center"
        Button {
          style: "background-color: color.primary; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer"
          "Start Building Now"
        }
        Button {
          style: "background-color: transparent; color: color.text; border: 1px solid color.border; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer"
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
  Div {
    style: "display: flex; min-height: 100vh; background-color: color.bg; font-family: sans-serif; color: color.text"
    
    // Sidebar
    Div {
      style: "width: 250px; background-color: color.card; padding: 20px; border-right: 1px solid #e5e7eb"
      H3 { style: "margin-bottom: 40px" "Dashboard" }
      Div {
        style: "display: flex; flex-direction: column; gap: 10px"
        Div { style: "padding: 10px; background-color: #eff6ff; color: color.primary; border-radius: 6px" "Overview" }
        Div { style: "padding: 10px; color: #6b7280" "Reports" }
        Div { style: "padding: 10px; color: #6b7280" "Settings" }
      }
    }

    // Main Content
    Div {
      style: "flex: 1; padding: 40px"
      
      Div {
        style: "display: flex; justify-content: space-between; margin-bottom: 30px"
        H2 { "Overview" }
        Button {
          style: "background-color: color.primary; color: white; border: none; padding: 8px 16px; border-radius: 6px"
          "Export Data"
        }
      }

      // Stats Grid
      Div {
        style: "display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 24px"
        
        Div {
          style: "background-color: color.card; padding: spacing.card; border-radius: radius.lg; box-shadow: 0 1px 3px rgba(0,0,0,0.1)"
          P { style: "color: #6b7280; font-size: 14px" "Total Revenue" }
          H3 { style: "font-size: 28px; margin-top: 8px" "$45,231" }
          Span { style: "color: #10b981; font-size: 14px" "+20.1% from last month" }
        }
        
        Div {
          style: "background-color: color.card; padding: spacing.card; border-radius: radius.lg; box-shadow: 0 1px 3px rgba(0,0,0,0.1)"
          P { style: "color: #6b7280; font-size: 14px" "Active Users" }
          H3 { style: "font-size: 28px; margin-top: 8px" "2,345" }
          Span { style: "color: #10b981; font-size: 14px" "+15% from last month" }
        }

        Div {
          style: "background-color: color.card; padding: spacing.card; border-radius: radius.lg; box-shadow: 0 1px 3px rgba(0,0,0,0.1)"
          P { style: "color: #6b7280; font-size: 14px" "Bounce Rate" }
          H3 { style: "font-size: 28px; margin-top: 8px" "42.3%" }
          Span { style: "color: #ef4444; font-size: 14px" "-2% from last month" }
        }
      }

      // Chart Area
      Div {
        style: "background-color: color.card; padding: spacing.card; border-radius: radius.lg; height: 400px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; color: #9ca3af; border: 2px dashed #e5e7eb"
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
  Div {
    style: "max-width: 390px; margin: 0 auto; border: 1px solid #e5e5e5; height: 844px; border-radius: 40px; overflow: hidden; font-family: sans-serif; position: relative"
    
    // Header Image
    Div {
      style: "height: 200px; background-color: #a1a1aa; background-image: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)"
    }

    // Profile Content
    Div {
      style: "padding: 0 24px; margin-top: -50px"
      
      // Avatar
      Div {
        style: "width: 100px; height: 100px; border-radius: 50%; background-color: white; border: 4px solid white; display: flex; align-items: center; justify-content: center; font-size: 40px; background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)"
        "🦁"
      }

      H2 { style: "margin: 16px 0 4px" "Alex Designer" }
      P { style: "color: #71717a; margin: 0 0 24px" "Product Designer @ UIH" }

      Div {
        style: "display: flex; gap: 12px; margin-bottom: 32px"
        Button {
          style: "flex: 1; background-color: #18181b; color: white; border: none; padding: 12px; border-radius: 24px; font-weight: 600"
          "Follow"
        }
        Button {
          style: "width: 48px; height: 48px; border-radius: 50%; border: 1px solid #e4e4e7; background: white; display: flex; align-items: center; justify-content: center"
          "✉️"
        }
      }

      // Menu List
      Div {
        style: "display: flex; flex-direction: column; gap: 8px"
        
        Div {
          style: "padding: 16px; background-color: color.gray; border-radius: 16px; display: flex; justify-content: space-between"
          "My Projects"
          Span { "→" }
        }
        Div {
          style: "padding: 16px; background-color: color.gray; border-radius: 16px; display: flex; justify-content: space-between"
          "Saved Templates"
          Span { "→" }
        }
        Div {
          style: "padding: 16px; background-color: color.gray; border-radius: 16px; display: flex; justify-content: space-between"
          "Settings"
          Span { "→" }
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
