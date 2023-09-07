/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
 
    theme: {
      // Other theme settings...
      extend: {
        backgroundColor: {
          'brown-light': '#D2B48C', // Light brown
          'brown-dark': '#8B4513',  // Dark brown
        },
        textColor: {
          'chess-white': '#FFFFFF', // White for pieces
          'chess-black': '#000000', // Black for pieces
        },
      },
    },
  
  plugins: [],
}

