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
})
