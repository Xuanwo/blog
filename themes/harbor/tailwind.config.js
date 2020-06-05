const { fontFamily, colors } = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    container: {
      center: true
    },
    extend: {
      colors: {
        black: '#22292f',

        gray: {
          ...colors.gray,
          100: '#f8fafc',
          200: '#f1f5f8',
          400: '#dae1e7',
          500: '#b8c2cc',
          600: '#8795a1',
          700: '#606f7b',
          800: '#3d4852',
          900: '#181E23',
          footer: '#424242'
        },
        indigo: {
          ...colors.indigo,
          100: '#e6e8ff',
          200: '#b2b7ff',
          400: '#7886d7',
          500: '#6574cd',
          600: '#5661b3',
          800: '#2f365f',
          900: '#191e38'
        }
      },
      spacing: {
        '2px': '2px'
      },
      maxWidth: {
        '3xl': '50rem',
        '5xl': '60rem',
        '6xl': '70rem'
      },
      lineHeight: {
        medium: '1.75'
      },
      fontFamily: {
        sans: [...fontFamily.sans],
        serif: [...fontFamily.serif],
        mono: [...fontFamily.mono]
      },
      boxShadow: {
        'outline-indigo': '0 0 1px 6px rgba(178, 183, 255, 0.5)'
      }
    }
  }
}
