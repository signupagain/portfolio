<script setup lang="ts">
	import dayjs from 'dayjs'
	import { useFileBrowserDataStore } from '../../stores/useFileBrowserDataStore'
	import type { DisplayedItem } from '../../utils/toDisplayedItem'

	const dataStore = useFileBrowserDataStore()
	const { activeItem, fileCategoryMap } = storeToRefs(dataStore)

	interface Active extends Omit<DisplayedItem, 'active'> {
		created: string
		path: string
	}

	const data = computed(() => {
		const target = activeItem.value

		if (!target) {
			return target
		}

		const props = fileCategoryMap.value.get(target.extension!)

		if (!props) {
			throw new Error('Unknown file type: ' + target.extension)
		}

		const { active, ...displayed } = toDisplayedItem(target, props)

		return {
			...displayed,
			created: dayjs(target.created).format('MM/DD HH:mm'),
			path: target.path,
		} satisfies Active
	})

	const details = computed(() => [
		['Kind:', data.value?.description],
		['Size:', data.value?.size],
		['Where:', data.value?.path],
		['Created:', data.value?.created],
		['Modified:', data.value?.modified],
	])
</script>

<template>
	<LazyUCard
		v-if="data"
		:ui="{
			root: 'bg-elevated',
			header: 'border-none',
			body: 'pt-0',
		}"
	>
		<template #title>
			<div class="flex aspect-square items-center justify-center" role="img">
				<LazyUIcon
					:name="'i-lucide-' + data.icon"
					class="size-25"
					:class="iconColorMap[data.color]"
				/>
			</div>
			<h2>{{ data.title }}</h2>
		</template>
		<ul>
			<li
				v-for="[label, detail] of details"
				:key="label"
				class="mb-2 flex gap-4"
			>
				<span class="w-[9ch] flex-none text-right">{{ label }}</span
				><span class="text-pretty wrap-anywhere">{{ detail }}</span>
			</li>
		</ul>
	</LazyUCard>
</template>

<style lang="scss"></style>
