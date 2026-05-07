import { useInfiniteQuery } from '@tanstack/vue-query'
import type { GalleryPageQuery } from '../pages/gallery/[[id]].vue'

export const usePhotos = (initialPage = 1) => {
	const { pexels } = useAppConfig()

	const route = useRoute('gallery-id')
	const searchQuery = ref('')

	watch(
		() => (route.query as GalleryPageQuery).search,
		(query) => {
			if (route.params.id) return

			searchQuery.value = query || ''
		},
		{ immediate: true },
	)

	const {
		data,
		suspense,
		hasNextPage: queryHasNextPage,
		fetchNextPage: queryFetchNextPage,
		error,
		isFetchingNextPage,
	} = useInfiniteQuery(() =>
		searchQuery.value ?
			useSearchOptions(searchQuery.value, pexels.max, initialPage)
		:	useCuratedOptions(pexels.max, initialPage),
	)

	const INITIAL_VISIBLE = 40
	const REVEAL_STEP = 10

	const endIndex = ref(INITIAL_VISIBLE)

	watch(searchQuery, () => {
		endIndex.value = INITIAL_VISIBLE
	})

	watch(
		() => data.value?.photos?.length,
		(length) => {
			if (!length) return

			endIndex.value = Math.min(endIndex.value, length)
		},
	)

	const photos = computed(
		() => data.value?.photos.slice(0, endIndex.value) ?? [],
	)

	const hasNextPage = computed(() => {
		const all = data.value?.photos ?? []
		return endIndex.value < all.length || queryHasNextPage.value
	})

	const fetchNextPage = async () => {
		const all = data.value?.photos ?? []

		if (endIndex.value < all.length) {
			endIndex.value = Math.min(endIndex.value + REVEAL_STEP, all.length)
			return
		}

		if (!queryHasNextPage.value) return

		const result = await queryFetchNextPage()
		const newAll = data.value?.photos ?? []

		endIndex.value = Math.min(endIndex.value + REVEAL_STEP, newAll.length)

		return result
	}

	if (import.meta.dev) {
		watch(
			() => error.value,
			(err) => {
				console.error('Error fetching photos: ', err)
			},
		)
	}

	onServerPrefetch(async () => {
		const { error: prefetchError } = await suspense()

		if (prefetchError && import.meta.dev) {
			console.error('Error fetching photos:', prefetchError)
		}
	})

	return {
		photos,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	}
}
