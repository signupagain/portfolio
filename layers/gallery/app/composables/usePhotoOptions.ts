import type {
	InferContractRouterInputs,
	InferContractRouterOutputs,
} from '@orpc/contract'
import {
	queryOptions,
	skipToken,
	type QueryFunction,
} from '@tanstack/vue-query'

type Input = InferContractRouterInputs<typeof pexelsContracts.client.getPhoto>
type Output = InferContractRouterOutputs<typeof pexelsContracts.client.getPhoto>

export const usePhotoOptions = (id: MaybeRefOrGetter<Input['id']>) => {
	const {
		queryKey: { root, photo },
		fetchOptions,
	} = useAppConfig().pexels

	const initialData = useInitialPhotoData()
	const idRef = toRef(id)

	const queryKey = [root, photo, idRef]

	const queryFn = computed(() =>
		isNaN(idRef.value) ? skipToken : (
			((async ({ signal }) =>
				$fetch(`/api/pexels/${idRef.value}`, {
					...fetchOptions,
					signal,
				})) satisfies QueryFunction<Output, typeof queryKey, never>)
		),
	)

	/**
	 * Couldn't use queryOptions here because of its type definition is not flexible enough to allow the queryKey.
	 *
	 * References:
	 * - https://github.com/TanStack/query/issues/7892
	 * - https://github.com/TanStack/query/pull/10452
	 * - https://github.com/TanStack/query/issues/10525
	 */

	return queryOptions({
		// @ts-expect-error - as mentioned above
		queryKey,
		queryFn,
		initialData: () => initialData.value,
		suspense: true,
	})
}
