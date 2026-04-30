<script setup lang="ts">
	import type { GalleryPageQuery } from '../../pages/gallery/[[id]].vue'

	const route = useRoute('gallery-id')
	const isSearchPage = computed(
		() => !!(route.query as GalleryPageQuery).search,
	)
</script>

<template>
	<UButton
		v-if="isSearchPage"
		to="/gallery"
		aria-label="回主頁"
		icon="lucide:home"
		class="rounded-full ring focus-visible:ring-2"
		color="neutral"
		size="sm"
		variant="ghost"
	/>
	<UPopover
		v-else
		:ui="{
			content: 'p-2',
		}"
	>
		<UButton
			aria-label="打開主頁提示"
			icon="lucide:home"
			class="rounded-full ring focus-visible:ring-2"
			color="neutral"
			size="sm"
			variant="ghost"
		/>

		<template #content> 已在主頁。點右下角快捷鍵，可回專案列表。 </template>
	</UPopover>
</template>

<style lang="scss"></style>
