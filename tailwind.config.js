/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FFD700', // warna utama dari mockup
        'secondary': '#1F2937', // warna background gelap dari mockup
        'accent': '#F3F4F6', // warna aksen/background terang dari mockup
        'textPrimary': '#111827', // warna teks utama (judul, heading)
        'textSecondary': '#F9FAFB', // warna teks sekunder/paragraf
        // ...existing custom colors
        'primary-900': '#1f4d2e',
        'primary-700': '#3b7a20',
        'primary-500': '#7aa34b',
        'accent-yellow': '#F7E69B',
        'beige': '#F4F1E7',
        'neutral-100': '#ffffff',
        'neutral-200': '#f7f7f2',
        'neutral-300': '#e9e7df',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      borderRadius: {
        'xl': '24px',
        'lg': '16px',
      },
      backgroundImage: {
        'hero-greenhouse': "url('/images/hero-greenhouse.jpg')",
        'hero-berries': "url('/images/hero-berries.jpg')",
      },
    },
  },
  plugins: [],
}
