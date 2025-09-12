/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'primary': ['Inter', 'sans-serif'],
        'secondary': ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        'secondary': {
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
      },
      heroBackground: {
        "hero-background": "url('./assets/doctors.jpg')"
      },
      keyframes: {
        "open-menu": {
          "0%": { transform: "scaleY(0)" },
          "80%": { transform: "scaleY(1.2)" },
          "100%": { transform: "scaleY(1)" }
        },
        "fadeInUp": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "slideInLeft": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        "slideInRight": {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        }
      },
      animation: {
        "open-menu": "open-menu 0.5s ease-in-out forwards",
        "fadeInUp": "fadeInUp 0.6s ease-out forwards",
        "slideInLeft": "slideInLeft 0.6s ease-out forwards", 
        "slideInRight": "slideInRight 0.6s ease-out forwards",
        "float": "float 3s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
