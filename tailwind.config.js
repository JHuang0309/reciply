module.exports = {
  theme: {
    extend: {
      keyframes: {
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-in-from-bottom': 'slide-in-from-bottom 0.5s ease-out',
      },
    },
  },
  plugins: [],
}