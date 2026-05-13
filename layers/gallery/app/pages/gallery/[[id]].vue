<script setup lang="ts">
	import { useQuery } from '@tanstack/vue-query'
	import type { SpeedDialsProps } from '#layers/speedDials/app/components/SpeedDials.vue'

	export type GalleryPageQuery = {
		search?: string
	}

	definePageMeta({
		layout: 'gallery-default',
		validate(meta) {
			const appConfig = useAppConfig()

			if (meta.name !== 'gallery-id') return appConfig.error.notFound

			return (
				(meta.params?.id === undefined ?
					true
				:	typeof +meta.params.id === 'number') || appConfig.error.notFound
			)
		},
		key(route) {
			return route.name
		},
	})

	const { data: page } = await useFetch('/api/gallery')

	if (!page.value) {
		const appConfig = useAppConfig()
		throw createError(appConfig.error.notFound)
	}

	useSeoMeta({
		title: page.value?.seo.title || page.value?.title,
		ogTitle: page.value?.seo.title || page.value?.title,
		description: page.value?.seo.description || page.value?.description,
		ogDescription: page.value?.seo.description || page.value?.description,
	})

	const listEl = useTemplateRef('list')

	onBeforeRouteUpdate((to, from) => {
		if (
			(to.name === 'gallery-id' && !!to.params.id) ||
			(from.name === 'gallery-id' && !!from.params.id)
		)
			return

		listEl.value?.getListEl()?.scrollTo(0, 0)
	})

	const route = useRoute('gallery-id')
	const id = computed(() => +(route.params.id || NaN))
	const { data, suspense } = useQuery(usePhotoOptions(id))

	onServerPrefetch(async () => {
		if (isNaN(id.value)) return

		const { error } = await suspense()

		if (error && import.meta.dev) {
			console.error('Error fetching photos:', error)
		}
	})

	const cardData = computed<typeof data.value | null>((old) =>
		isNaN(id.value) && old ? old : (data.value ?? null),
	)

	const introEl = useTemplateRef('intro')

	const dials: SpeedDialsProps['dials'] = [
		{
			icon: 'lucide:chevron-up',
			label: '回到頂部',
			onClick: () => {
				const el = listEl.value?.getListEl()

				if (!el) return

				el.scrollTo({
					top: 0,
					behavior: 'smooth',
				})
			},
		},
		{
			icon: 'lucide:book',
			label: '頁面主旨',
			onClick: () => {
				if (!introEl.value) return

				introEl.value.toggle()
			},
		},
	]
</script>

<template>
	<main v-if="page">
		<GalleryList ref="list">
			<UPageHero
				:title="page.title"
				:description="page.description"
				:ui="{
					description: 'text-pretty',
				}"
			/>
		</GalleryList>
		<ClientOnly>
			<LazyGalleryCard v-if="cardData" :data="cardData" />
		</ClientOnly>
		<GalleryIntro ref="intro" />
		<SpeedDials :dials="dials" />
	</main>
</template>

<style lang="scss"></style>
