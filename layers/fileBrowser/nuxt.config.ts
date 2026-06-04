export default defineNuxtConfig({
	modules: ['@nuxt/ui', '@pinia/nuxt'],

	extends: ['../speedDials'],

	vite: {
		optimizeDeps: {
			include: ['dayjs'],
		},
	},

	runtimeConfig: {
		public: {
			baseURL: process.env.URL || 'https://localhost:3000',
		},
	},
})
