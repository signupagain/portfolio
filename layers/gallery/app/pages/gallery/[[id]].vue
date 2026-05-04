<script setup lang="ts">
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
</script>

<template>
	<main v-if="page">
		<UPageHero
			:title="page.title"
			:description="page.description"
			:ui="{
				description: 'text-pretty',
			}"
		/>
	</main>
</template>

<style lang="scss"></style>
