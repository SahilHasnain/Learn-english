/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Background colors - YouTube Dark Mode inspired
        background: {
          primary: '#0f0f0f',
          secondary: '#1f1f1f',
          tertiary: '#272727',
          elevated: '#3f3f3f',
        },
        // Text colors
        text: {
          primary: '#ffffff',
          secondary: '#aaaaaa',
          tertiary: '#717171',
          disabled: '#525252',
        },
        // Border colors
        border: {
          primary: '#3f3f3f',
          secondary: '#272727',
          subtle: '#1f1f1f',
        },
        // Accent colors - Educational theme
        accent: {
          primary: '#8b5cf6',
          secondary: '#3b82f6',
          success: '#10b981',
          error: '#ef4444',
          warning: '#f59e0b',
          info: '#06b6d4',
        },
        // Interactive states
        interactive: {
          hover: '#525252',
          active: '#717171',
          disabled: '#272727',
        },
        // Subject-specific colors
        physics: {
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
        },
        chemistry: {
          DEFAULT: '#10b981',
          light: '#34d399',
        },
        biology: {
          DEFAULT: '#ec4899',
          light: '#f472b6',
        },
      },
    },
  },
  plugins: [],
};
