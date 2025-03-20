/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,mdx}",
    "./components/**/*.{js,jsx,mdx}",
    "./app/**/*.{js,jsx,mdx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        md: '12px', // Customize the blur level
      },
    },
  },
  variants: {
    extend: {
      backdropBlur: ['responsive'],
    },
  },
  plugins: [],
};
