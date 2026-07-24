export default defineNuxtConfig({
	modules: ['@nuxt/ui', '@pinia/nuxt'],

	extends: ['../speedDials'],

	vite: {
		optimizeDeps: {
			include: ['dayjs'],
		},
	},
})
