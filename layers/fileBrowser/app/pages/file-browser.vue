<script setup lang="ts">
	import { useFileBrowserDataStore } from '../stores/useFileBrowserDataStore'

	definePageMeta({
		layout: 'file-browser-default',
	})

	const { data: page } = await useFetch('/api/fileBrowser')

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

	const dataStore = useFileBrowserDataStore()

	const { width } = useWindowSize()
	const isAsideVisible = computed(() => width.value >= 1024)

	onBeforeUnmount(() => {
		dataStore.moveToNode(0)
	})
</script>

<template>
	<div v-if="page" class="layout">
		<FileBrowserHeader class="header" :title="page.title" />
		<FileBrowserMain class="main" :is-aside-visible="isAsideVisible" />
		<ClientOnly>
			<FileBrowserAside class="aside" :is-aside-visible="isAsideVisible" />
		</ClientOnly>
		<FileBrowserFooter class="footer" />
	</div>
</template>

<style lang="scss" scoped>
	.layout {
		display: flex;
		flex-flow: column;

		height: 100vh;

		@media (min-width: 1024px) {
			display: grid;
			grid:
				'header aside'
				'main aside' 1fr
				'footer aside'
				/ 1fr 23em;
		}
	}

	.header {
		grid-area: header;
		user-select: none;
	}

	:deep(.main) {
		flex: 1;
		user-select: none;

		@media (min-width: 1024px) {
			grid-area: main;
		}
	}

	.aside {
		grid-area: aside;
	}

	.footer {
		grid-area: footer;
	}
</style>
