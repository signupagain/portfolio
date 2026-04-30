import type {
	InferContractRouterInputs,
	InferContractRouterOutputs,
} from '@orpc/contract'
import {
	infiniteQueryOptions,
	skipToken,
	type QueryFunction,
} from '@tanstack/vue-query'

type Input = InferContractRouterInputs<
	typeof pexelsContracts.client.searchPhotos
>
type Output = InferContractRouterOutputs<
	typeof pexelsContracts.client.searchPhotos
>

export const useSearchOptions = (
	query: MaybeRefOrGetter<string>,
	max: number,
	initialPage = 1,
) => {
	const {
		queryKey: { root, search },
		fetchOptions,
	} = useAppConfig().pexels

	const queryRef = toRef(query)

	const queryKey = [root, search, queryRef]

	const initialPageParam = {
		page: initialPage,
		per_page: max,
	}

	const queryFn = computed(() =>
		!queryRef.value ? skipToken : (
			((async ({ signal, pageParam }) =>
				$fetch('/api/pexels/search', {
					...fetchOptions,
					query: {
						...pageParam,
						query: queryRef.value,
					} satisfies Input,
					signal,
				})) satisfies QueryFunction<
				Output,
				typeof queryKey,
				typeof initialPageParam
			>)
		),
	)

	return infiniteQueryOptions({
		queryKey,
		queryFn,
		staleTime: Infinity,
		initialPageParam,
		getNextPageParam: (lastPage) =>
			lastPage.next_page ?
				{
					...initialPageParam,
					page: lastPage.page + 1,
				}
			:	null,
		select: (data) => ({
			photos: data.pages.flatMap((page) => page.photos),
			total: data.pages[data.pages.length - 1]?.total_results ?? 0,
		}),
	})
}
