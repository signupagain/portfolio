import type { NuxtError } from 'nuxt/app'

export default defineAppConfig({
	error: {
		notFound: {
			statusCode: 404,
			message: '找不到該頁',
			fatal: true,
		},
	} satisfies Record<string, Partial<NuxtError<unknown>>>,
})
