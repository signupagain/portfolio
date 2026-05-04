import type { NuxtError } from 'nuxt/app'

export default defineAppConfig({
	pexels: {
		max: 80,
		queryKey: {
			root: 'pexels',
			photo: 'photo',
			curated: 'curated',
			search: 'search',
		},
		fetchOptions: {
			headers: {
				Accept: 'application/json',
			},
			timeout: 5000,
		},
	},

	error: {
		notFound: {
			statusCode: 404,
			message: '找不到該頁',
			fatal: true,
		},
	} satisfies Record<string, Partial<NuxtError<unknown>>>,
})
