export const LOGIN_PAGE = `meta {
  title: "Login"
  route: "/login"
}

style {
  color.primary: "#4F46E5"
  color.primary.hover: "#4338CA"
  color.text.primary: "#111827"
  color.text.secondary: "#6B7280"
  color.bg.page: "#F3F4F6"
  color.bg.card: "#FFFFFF"
  color.border: "#D1D5DB"
  spacing.sm: "8px"
  spacing.md: "16px"
  spacing.lg: "24px"
  spacing.xl: "32px"
  radius.md: "8px"
  radius.lg: "12px"
}

layout {
  Div(class: "login-page", style: "min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--color-bg-page)") {
    Div(class: "login-card", style: "width: 100%; max-width: 400px; background: var(--color-bg-card); padding: var(--spacing-xl); border-radius: var(--radius-lg); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)") {
      Div(class: "header", style: "text-align: center; margin-bottom: var(--spacing-xl)") {
        H1(style: "font-size: 24px; font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--spacing-sm)") {
          "Welcome Back"
        }
        P(style: "color: var(--color-text-secondary)") {
          "Sign in to your account to continue"
        }
      }
      Form(class: "login-form") {
        Div(class: "form-group", style: "margin-bottom: var(--spacing-lg)") {
          Label(for: "email", style: "display: block; font-size: 14px; font-weight: 500; color: var(--color-text-primary); margin-bottom: var(--spacing-sm)") {
            "Email Address"
          }
          Input(type: "email", id: "email", placeholder: "you@example.com", style: "width: 100%; padding: 10px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-md)") {
            ""
          }
        }
        Div(class: "form-group", style: "margin-bottom: var(--spacing-lg)") {
          Div(class: "label-row", style: "display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm)") {
            Label(for: "password", style: "font-size: 14px; font-weight: 500; color: var(--color-text-primary)") {
              "Password"
            }
            A(href: "/forgot-password", style: "font-size: 14px; color: var(--color-primary); text-decoration: none") {
              "Forgot password?"
            }
          }
          Input(type: "password", id: "password", style: "width: 100%; padding: 10px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-md)") {
            ""
          }
        }
        Button(type: "submit", style: "width: 100%; padding: 10px; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-md); font-weight: 500; cursor: pointer") {
          "Sign In"
        }
      }
      Div(class: "footer", style: "margin-top: var(--spacing-lg); text-align: center; font-size: 14px; color: var(--color-text-secondary)") {
        "Don't have an account? "
        A(href: "/signup", style: "color: var(--color-primary); text-decoration: none; font-weight: 500") {
          "Sign up"
        }
      }
    }
  }
}
`;
