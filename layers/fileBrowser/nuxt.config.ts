export default defineNuxtConfig({
	modules: ['@nuxt/ui', '@pinia/nuxt'],

	vite: {
		optimizeDeps: {
			include: ['dayjs'],
		},
	},
})
