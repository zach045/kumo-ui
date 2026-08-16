export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
      },
      fontSize: {
        display: ["120px", { lineHeight: "72px", letterSpacing: "-0.02em" }],
        h1: ["48px", { lineHeight: "56px", letterSpacing: "-0.02em" }],
        h2: ["36px", { lineHeight: "44px", letterSpacing: "-0.015em" }],
        h3: ["24px", { lineHeight: "32px", letterSpacing: "-0.01em" }],
        body: ["16px", { lineHeight: "24px" }],
        sm: ["14px", { lineHeight: "20px" }],
        xs: ["12px", { lineHeight: "16px" }],
      },
    },
  },
  plugins: [],
};