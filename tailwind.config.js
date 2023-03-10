/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Breakpoints
      screens: {
        '-2xl': { max: '1440px' },
        // => @media (max-width: 1440px) { ... }

        '-xl': { max: '1279px' },
        // => @media (max-width: 1279px) { ... }

        '-lg': { max: '1024px' },
        // => @media (max-width: 1023px) { ... }

        '-2md': { max: '834px' },
        // => @media (max-width: 834px) { ... }

        '-md': { max: '767px' },
        // => @media (max-width: 767px) { ... }

        '-sm': { max: '639px' },
        // => @media (max-width: 639px) { ... }

        '-xs': { max: '428px' },
        // => @media (max-width: 639px) { ... }
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar-hide'),
  ],
};
