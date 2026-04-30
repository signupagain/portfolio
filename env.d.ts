declare namespace NodeJS {
	interface ProcessEnv {
		/* Pexels API */
		readonly PEXELS_URL: string
		readonly PEXELS_TOKEN: string

		/* VueQuery */
		readonly VUE_QUERY_STALE_TIME: string
	}
}
