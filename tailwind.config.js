/** @type {import('tailwindcss').Config} */
import { settings } from './src/config.ts';

module.exports = {
  content: ['./src/**/*.{svelte,js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: settings.primaryColor,
        secondary: settings.secondaryColor,
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

