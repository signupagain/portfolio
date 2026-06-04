<script setup lang="ts">
	import { useFileBrowserDataStore } from '../../stores/useFileBrowserDataStore'

	const dataStore = useFileBrowserDataStore()
	const { currentFolderCount, currentFileCount, selectedItemsCount } =
		storeToRefs(dataStore)

	const state = computed(() => {
		const folders =
			currentFolderCount.value ? currentFolderCount.value + ' folders' : ''
		const files =
			currentFileCount.value ? currentFileCount.value + ' files' : ''
		const selected =
			selectedItemsCount.value ? selectedItemsCount.value + ' selected' : ''

		return (
			[folders, files, selected].filter((str) => str !== '').join(', ') ||
			'No Data'
		)
	})
</script>

<template>
	<footer class="border-default border-t-2 p-4 text-center">
		<p>{{ state }}</p>
	</footer>
</template>

<style lang="scss"></style>
