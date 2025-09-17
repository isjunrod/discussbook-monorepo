/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				testSohneBuch: ['TestSohneBuch'],
				testSohneKraftig: ['TestSohneKraftig'],
				TestSohneLeicht: ['TestSohneLeicht']
			},
			colors: {
				neutral: {
					'50': 'var(--neutral50)',
					'100': 'var(--neutral100)',
					'200': 'var(--neutral200)',
					'300': 'var(--neutral300)',
					'400': 'var(--neutral400)',
					'500': 'var(--neutral500)',
					'600': 'var(--neutral600)',
					'700': 'var(--neutral700)',
					'800': 'var(--neutral800)',
					'900': 'var(--neutral900)',
					'950': 'var(--neutral950)'
				},
				sidebar: {
					DEFAULT: 'var(--neutral950)',
					foreground: 'var(--neutra800)',
					accent: 'var(--neutral800)',
					'accent-foreground': 'var(--neutral50)',
					border: 'var(--neutral800)',
				}
			}
		}
	},
}

