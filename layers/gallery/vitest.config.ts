import { fileURLToPath } from 'node:url'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineVitestProject({
	test: {
		include: ['test/**/*.{test,spec}.ts'],
		environment: 'nuxt',
		environmentOptions: {
			nuxt: {
				rootDir: fileURLToPath(new URL('.', import.meta.url)),
				domEnvironment: 'happy-dom',
				overrides: {
					pages: false,
				},
			},
		},
	},
})
