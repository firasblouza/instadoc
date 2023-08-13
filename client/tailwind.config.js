/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      heroBackground: {
        "hero-background": "url('./assets/doctors.jpg')"
      }
    }
  },
  plugins: []
};
