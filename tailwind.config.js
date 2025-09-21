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
        // 🌰 Klimacek brown palette (branding utama)
        'klimacek-brown-50':  '#F5EFE6',
        'klimacek-brown-100': '#EADFCB',
        'klimacek-brown-300': '#DDBA7D',
        'klimacek-brown-500': '#8C5E3C',
        'klimacek-brown-700': '#5C3A21',
        'klimacek-brown-900': '#2E1A11',

        // 🌰 Brand aliases (untuk konsistensi di komponen)
        'primary': '#6B4226',      // cokelat tua utama (navbar, tombol utama)
        'secondary': '#D2B48C',    // cokelat muda / background terang
        'accent': '#A0522D',       // cokelat sedang untuk hover/aksen
        'textPrimary': '#2E1A12',  // teks judul (gelap)
        'textSecondary': '#F5F5DC',// teks isi (beige terang)

        // 🌰 Override primary shades (ganti hijau → cokelat)
        'primary-900': '#2E1A11',  // deep brown
        'primary-700': '#5C3A21',  // dark brown
        'primary-500': '#8C5E3C',  // medium brown

        // 🌰 Aksen lain tetap
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
