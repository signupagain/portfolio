import type { InferContractRouterOutputs } from '@orpc/contract'

type Output = InferContractRouterOutputs<typeof pexelsContracts.client.getPhoto>

export const useInitialPhotoData = () =>
	useState<Output | undefined>('initialPhotoData', () => undefined)
