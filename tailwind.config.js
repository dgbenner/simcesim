/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Cesim header / chrome blues
        header: {
          top: '#1f5cbf',
          bottom: '#194a93',
          nav: '#1b5099',      // nav row band
          active: '#0f3a73',   // active nav tab block
        },
        cesim: {
          link: '#2563b5',     // blue links / active subnav
          rule: '#2f6fb0',     // section-title underline rule
          ink: '#2a2f36',      // primary text
          muted: '#6b7280',    // secondary text
        },
        // Team / brand accents
        brand: {
          red: '#d8382b',      // Hotel Red
          green: '#3aa544',    // The Northline
          blue: '#2f6fb0',     // Blue
          orange: '#e8821e',   // Hotel of America
        },
        surface: {
          page: '#eff0f2',     // page background
          card: '#ffffff',
          footer: '#e9eaec',
          tablehead: '#e4edf7', // pale blue table header
          input: '#eef4fb',     // editable cell tint
        },
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'header-grad': 'linear-gradient(to bottom, #1f5cbf, #194a93)',
      },
    },
  },
  plugins: [],
}
