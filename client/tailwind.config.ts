import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        dswall: "url('/client/public/bg.svg')",
      },
      backgroundColor: {
        blue: "#5865F2",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
