const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{html,js,ts,tsx}', './public/**/*.{html,tsx}'],
  theme: {
    extend: {},
    // colors: {
    //   transparent: 'transparent',
    //   current: 'currentColor',
    //   black: colors.black,
    //   white: colors.white,
    //   gray: colors.neutral,
    //   indigo: colors.indigo,
    //   red: colors.rose,
    //   yellow: colors.amber,
    // }
  },
  plugins: [],
}
