
# minor content update
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          50: "#f7f7f2",
          100: "#eef0e3",
          200: "#d9dfbe",
          300: "#b9c98c",
          400: "#97ae60",
          500: "#7a9446",
          600: "#5f7535",
          700: "#4c5d2c",
          800: "#3f4b27",
          900: "#354022"
        }
      }
    }
  },
  plugins: []
}

export default config

