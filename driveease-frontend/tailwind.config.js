/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          base: '#090b0e',       // Deepest cockpit obsidian
          surface: '#0f1217',    // Cockpit console surface
          card: '#141820',       // Carbon-weave elevated panel
          hover: '#1a202b',      // Cockpit active hover
          border: 'rgba(255, 255, 255, 0.08)',
          borderLight: '#242b38',
          muted: '#8b949e',
        },
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ff5a00',        // Signature DriveEase Vibrant Orange / Tachometer Redline
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          accent: '#ff5a00',
        },
        cockpit: {
          neon: '#ff5a00',
          rpmGreen: '#10b981',
          rpmYellow: '#f59e0b',
          rpmRed: '#ef4444',
          cyan: '#06b6d4',
          bezel: '#1f2430',
        }
      },
      fontFamily: {
        sans: ['"Chakra Petch"', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        automotive: ['"Chakra Petch"', 'sans-serif'],
        digital: ['"Orbitron"', 'monospace'],
        hud: ['"Orbitron"', '"Chakra Petch"', 'sans-serif'],
      },
      boxShadow: {
        'brand': '0 10px 30px -5px rgba(255, 90, 0, 0.4)',
        'glow-orange': '0 0 35px 0 rgba(255, 90, 0, 0.35)',
        'glow-hud': '0 0 20px 2px rgba(255, 90, 0, 0.25)',
        'card': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
        'cockpit': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1), 0 20px 35px -10px rgba(0, 0, 0, 0.8)',
      }
    },
  },
  plugins: [],
}
