import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ground: "#0B0E12",
        surface: "#11151B",
        snow: "#EEF3F8",
        line: "rgba(238,243,248,0.14)",
        action: "#D7FF3E",
        alert: "#FF6B3D",
        paper: "#FAFAFA",
        "paper-soft": "#F5F5F5",
        "paper-raised": "#E5E5E5",
        ink: "#0A0A0A",
        "ink-secondary": "#525252",
        "ink-tertiary": "#A3A3A3",
        "editorial-red": "#EF4444",
      },
      fontFamily: {
        display: ["Anybody", "sans-serif"],
        body: ["Work Sans", "sans-serif"],
        mono: ["Martian Mono", "monospace"],
      },
      fontSize: {
        "step--1": "clamp(.75rem, .72rem + .12vw, .9rem)",
        "step-0": "clamp(.95rem, .88rem + .3vw, 1.15rem)",
        "step-1": "clamp(1.2rem, 1.05rem + .7vw, 1.55rem)",
        "step-2": "clamp(1.55rem, 1.3rem + 1.2vw, 2.1rem)",
        "step-3": "clamp(2rem, 1.6rem + 2vw, 3rem)",
        "step-4": "clamp(2.65rem, 2rem + 3.5vw, 4.5rem)",
        "step-5": "clamp(3.5rem, 2.5rem + 5vw, 7rem)",
        "step-6": "clamp(4.5rem, 3rem + 7vw, 10rem)",
      },
      borderRadius: {
        none: "0",
      },
    },
  },
  plugins: [],
};

export default config;