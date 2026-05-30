declare namespace NodeJS {
	interface ProcessEnv {
		/* Pexels API */
		readonly PEXELS_URL: string
		readonly PEXELS_TOKEN: string

		/* VueQuery */
		readonly VUE_QUERY_STALE_TIME: string

		/* Nelify */
		readonly NETLIFY: string

		/* File-Browser */
		readonly FILE_SYSTEM_MAX_DEPTH: string
	}
}
