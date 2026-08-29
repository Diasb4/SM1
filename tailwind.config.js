/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        pastel: {
          purple: {
            light: '#FAF5FF',
            DEFAULT: '#F3E8FF',
            border: '#E9D5FF',
            text: '#7E22CE',
          },
          blue: {
            light: '#F0F9FF',
            DEFAULT: '#E0F2FE',
            border: '#BAE6FD',
            text: '#0369A1',
          },
          green: {
            light: '#F0FDF4',
            DEFAULT: '#DCFCE7',
            border: '#BBF7D0',
            text: '#15803D',
          },
          amber: {
            light: '#FFFBEB',
            DEFAULT: '#FEF3C7',
            border: '#FDE68A',
            text: '#B45309',
          },
          pink: {
            light: '#FDF2F8',
            DEFAULT: '#FCE7F3',
            border: '#FBCFE8',
            text: '#BE185D',
          }
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
        'floating': '0 10px 30px -5px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
