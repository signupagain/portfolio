<script setup lang="ts">
	import { useFileBrowserDataStore } from '../../stores/useFileBrowserDataStore'

	const { isAsideVisible } = defineProps<{
		isAsideVisible: boolean
	}>()

	const dataStore = useFileBrowserDataStore()
	const { drawerBtn } = storeToRefs(dataStore)

	whenever(
		() => isAsideVisible,
		() => {
			drawerBtn.value = null
		},
	)

	const open = ref(false)

	watch(
		() => drawerBtn.value,
		(el) => (open.value = !!el),
	)

	function focusDrawerBtn() {
		drawerBtn.value?.focus()
		drawerBtn.value = null
	}
</script>

<template>
	<div>
		<aside
			v-if="isAsideVisible"
			class="border-default scrollbar-thin h-full overflow-auto border-l-2 p-4"
		>
			<LazyFileBrowserCard hydrate-on-idle />
		</aside>
		<LazyUDrawer
			v-model:open="open"
			hydrate-on-idle
			aria-label="檔案檢視彈窗"
			:ui="{
				body: 'max-h-[50vh] overflow-auto scrollbar-thin',
			}"
			@close="focusDrawerBtn"
		>
			<template #body
				><LazyFileBrowserCard class="mx-auto my-4 max-w-100"
			/></template>
		</LazyUDrawer>
	</div>
</template>

<style lang="scss"></style>
