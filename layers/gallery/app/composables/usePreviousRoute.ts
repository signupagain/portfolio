import type { RouteNamedMap } from 'vue-router/auto-routes'

export const usePreviousRouteName = () =>
	useState<keyof RouteNamedMap | null>('previousRouteName', () => null)
