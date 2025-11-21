export const PRICING_PAGE = `meta {
  title: "Pricing"
  route: "/pricing"
}

style {
  color.primary: "#2563EB"
  color.text.main: "#1E293B"
  color.text.muted: "#64748B"
  color.bg.main: "#F8FAFC"
  color.bg.card: "#FFFFFF"
  spacing.md: "16px"
  spacing.lg: "24px"
  spacing.xl: "32px"
  radius.lg: "16px"
}

layout {
  Div(class: "pricing-page", style: "min-height: 100vh; background: var(--color-bg-main); padding: 64px 24px") {
    Div(class: "header", style: "text-align: center; max-width: 600px; margin: 0 auto 64px") {
      H1(style: "font-size: 36px; font-weight: 800; color: var(--color-text-main); margin-bottom: 16px") {
        "Simple, Transparent Pricing"
      }
      P(style: "font-size: 18px; color: var(--color-text-muted)") {
        "Choose the plan that's right for you and your team."
      }
    }
    Div(class: "pricing-grid", style: "display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; max-width: 1200px; margin: 0 auto") {
      Div(class: "plan-card", style: "background: var(--color-bg-card); padding: 32px; border-radius: var(--radius-lg); border: 1px solid #E2E8F0") {
        H3(style: "font-size: 20px; font-weight: 600; color: var(--color-text-main)") {
          "Starter"
        }
        Div(class: "price", style: "margin: 24px 0; font-size: 48px; font-weight: 800; color: var(--color-text-main)") {
          "$0"
          Span(style: "font-size: 16px; font-weight: 400; color: var(--color-text-muted)") {
            "/mo"
          }
        }
        Button(style: "width: 100%; padding: 12px; background: #E2E8F0; color: var(--color-text-main); border: none; border-radius: 8px; font-weight: 600; cursor: pointer; margin-bottom: 32px") {
          "Get Started"
        }
        Div(class: "features") {
          P(style: "margin-bottom: 12px; color: var(--color-text-muted)") { "✓ 1 Project" }
          P(style: "margin-bottom: 12px; color: var(--color-text-muted)") { "✓ Basic Analytics" }
          P(style: "margin-bottom: 12px; color: var(--color-text-muted)") { "✓ Community Support" }
        }
      }
      Div(class: "plan-card featured", style: "background: var(--color-bg-card); padding: 32px; border-radius: var(--radius-lg); border: 2px solid var(--color-primary); position: relative; transform: scale(1.05)") {
        Div(style: "position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--color-primary); color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600") {
          "MOST POPULAR"
        }
        H3(style: "font-size: 20px; font-weight: 600; color: var(--color-text-main)") {
          "Pro"
        }
        Div(class: "price", style: "margin: 24px 0; font-size: 48px; font-weight: 800; color: var(--color-text-main)") {
          "$29"
          Span(style: "font-size: 16px; font-weight: 400; color: var(--color-text-muted)") {
            "/mo"
          }
        }
        Button(style: "width: 100%; padding: 12px; background: var(--color-primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; margin-bottom: 32px") {
          "Start Free Trial"
        }
        Div(class: "features") {
          P(style: "margin-bottom: 12px; color: var(--color-text-main)") { "✓ Unlimited Projects" }
          P(style: "margin-bottom: 12px; color: var(--color-text-main)") { "✓ Advanced Analytics" }
          P(style: "margin-bottom: 12px; color: var(--color-text-main)") { "✓ Priority Support" }
          P(style: "margin-bottom: 12px; color: var(--color-text-main)") { "✓ Custom Domains" }
        }
      }
      Div(class: "plan-card", style: "background: var(--color-bg-card); padding: 32px; border-radius: var(--radius-lg); border: 1px solid #E2E8F0") {
        H3(style: "font-size: 20px; font-weight: 600; color: var(--color-text-main)") {
          "Enterprise"
        }
        Div(class: "price", style: "margin: 24px 0; font-size: 48px; font-weight: 800; color: var(--color-text-main)") {
          "$99"
          Span(style: "font-size: 16px; font-weight: 400; color: var(--color-text-muted)") {
            "/mo"
          }
        }
        Button(style: "width: 100%; padding: 12px; background: #E2E8F0; color: var(--color-text-main); border: none; border-radius: 8px; font-weight: 600; cursor: pointer; margin-bottom: 32px") {
          "Contact Sales"
        }
        Div(class: "features") {
          P(style: "margin-bottom: 12px; color: var(--color-text-muted)") { "✓ Everything in Pro" }
          P(style: "margin-bottom: 12px; color: var(--color-text-muted)") { "✓ SSO & SAML" }
          P(style: "margin-bottom: 12px; color: var(--color-text-muted)") { "✓ Dedicated Account Manager" }
          P(style: "margin-bottom: 12px; color: var(--color-text-muted)") { "✓ 99.9% SLA" }
        }
      }
    }
  }
}
`;
