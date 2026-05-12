import fs from 'fs'
import path from 'path'

export default defineNuxtConfig({
	extends: ['../colorModeBtn', '../speedDials'],

	runtimeConfig: {
		pexelsURL: process.env.PEXELS_URL,
		pexelsToken: process.env.PEXELS_TOKEN,
	},

	image: {
		domains: ['images.pexels.com'],
		alias: {
			pexels: 'https://images.pexels.com/photos',
		},
	},

	modules: [
		'@nuxt/image',
		'@nuxt/test-utils/module',
		'@nuxt/ui',
		'@vueuse/nuxt',
		'@peterbud/nuxt-query',
		'@vueuse/nuxt',
	],

	nuxtQuery: {
		queryClientOptions: {
			defaultOptions: {
				queries: {
					staleTime: 1000 * 60 * 5, // 5 minutes
				},
			},
		},
	},

	experimental: {
		typedPages: true,
	},

	$development: {
		devServer: {
			https: {
				key: fs
					.readFileSync(path.resolve(process.cwd(), 'certs/localhost-key.pem'))
					.toString(),
				cert: fs
					.readFileSync(path.resolve(process.cwd(), 'certs/localhost.pem'))
					.toString(),
			},
			host: '0.0.0.0',
			port: 3000,
		},
	},
})
