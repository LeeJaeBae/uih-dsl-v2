export const HELLO_WORLD = `meta {
  title: "UIH Playground"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
}

layout {
  Div(class:"min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8") {
    Div(class:"max-w-4xl mx-auto") {
      H1(class:"text-4xl font-bold text-gray-900 mb-4") {
        "UIH DSL Playground"
      }
      P(class:"text-lg text-gray-600 mb-8") {
        "Try editing the UIH code on the left and see the live preview!"
      }
      Div(class:"bg-white p-6 rounded-lg shadow-lg") {
        H2(class:"text-2xl font-semibold mb-4") {
          "Hello World"
        }
        P(class:"text-gray-700") {
          "This is compiled from UIH DSL and rendered in real-time."
        }
      }
    }
  }
}`;
