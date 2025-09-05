/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'bg-gradient':
          'linear-gradient(to right,  #EEEDF3 0%, #EFEEF4 7%,   #EFECF3 14%,   #F0EDF4 21%,   #F2ECF4 29%,   #EFECF3 36%,   #EEEBF6 43%,   #EBEAF9 50%,   #E8E8F8 57%,   #E6E7F8 64%,   #E4E5F9 71%,   #E3E4F8 79%,   #E2E3F8 86%,   #E0E0FC 93%,   #DCDFFC 100%);',
      },
      colors: {
        'color-text-placeholder': '#71717A',
        'color-inverse': '#18181B',
      },
      height: {
        15: '60px',
        144: '572px',
        155: '620px',
        172: '658px',
      },
      screens: {
        'custom-xs': '460px',
        'custom-s': '432px',
        'custom-smd': '600px',
        'custom-xlg': '900px',
        'custom-4xs': '206px',
      },
      fontFamily: {
        robotoSerif: ['Roboto Serif', 'serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        // Thiết lập thanh cuộn mỏng cho Firefox
        '.scrollbar-thin': {
          scrollbarWidth: 'thin', // Chỉ Firefox hỗ trợ
          scrollbarColor: '#7217bd3f transparent', // Màu thanh cuộn cho Firefox
        },
        // Tùy chỉnh thanh cuộn cho Chrome, Safari, Edge (Webkit browsers)
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '4px', // Độ dày của thanh cuộn
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent', // Nền của track thanh cuộn
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#7217bd3f', // Màu của thanh cuộn
            borderRadius: '4px', // Bo góc thanh cuộn
          },
        },
        // Giữ không gian cho scrollbar khi nó xuất hiện
        '.scrollbar-gutter': {
          scrollbarGutter: 'stable', // Tạo không gian cho thanh cuộn
        },
        '.mask-rounded-oval': {
          /** Đặt vị trí mask */
          'mask-position': 'center',
          /** Không lặp lại */
          'mask-repeat': 'no-repeat',
          /** Mask có kích thước vừa khít */
          'mask-size': 'contain',
          'mask-image':
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='none'%3E%3Cpath fill='%23000' d='M100 0C20 0 0 20 0 100s20 100 100 100 100-20 100-100S180 0 100 0z'/%3E%3C/svg%3E\")",
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    },
    require('tailwindcss-animate'),
  ],
}
