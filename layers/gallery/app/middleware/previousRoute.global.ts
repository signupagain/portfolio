import type { RouteNamedMap } from 'vue-router/auto-routes'

export default defineNuxtRouteMiddleware((to, from) => {
	if (to.fullPath === from.fullPath) return

	const previousRoute = usePreviousRouteName()

	previousRoute.value = (from?.name as keyof RouteNamedMap) || null
})
