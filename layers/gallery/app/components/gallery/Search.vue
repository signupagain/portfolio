<script setup lang="ts">
	import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
	import { useInfiniteQuery } from '@tanstack/vue-query'
	import type { GalleryPageQuery } from '../../pages/gallery/[[id]].vue'

	const state = reactive({
		isOpen: false,
		searchKbds: ['ctrl', 'k'],
		placeholder: '搜尋各式主題，如: 花、動物、建築等...',
		modal: {
			title: '搜尋圖片主題',
			description: '搜尋圖片主題或已有紀錄，使畫廊改變主題。',
		},

		dynamicValue: '',
		searchValue: {} satisfies CommandPaletteItem,

		searchQuery: '',
	})

	defineShortcuts({
		[state.searchKbds.join('_')]: {
			usingInput: true,
			handler: () => (state.isOpen = !state.isOpen),
		},
	})

	const records = useSearchRecords()

	const groups = computed<CommandPaletteGroup[]>(() => [
		{
			id: 'search-records',
			label:
				state.dynamicValue.length ?
					`"${state.dynamicValue}"相關的紀錄...`
				:	`搜尋紀錄，累計${records.size.value}筆`,
			items: records.values.value.map<CommandPaletteItem>((record) => ({
				label: record,
			})),
		},
	])

	const select = (value: CommandPaletteItem) => {
		if (!value?.label) return

		value.label = value.label.trim()

		if (!value.label.length) return

		state.searchValue = value

		state.searchQuery = value.label
	}

	const search = (event: KeyboardEvent) => {
		if (state.searchQuery.length) return

		const value = (event.target as HTMLInputElement).value.trim()

		if (!value.length) return

		state.searchQuery = value
	}

	const { pexels } = useAppConfig()

	const { data, error, isFetching } = useInfiniteQuery(
		useSearchOptions(() => state.searchQuery, pexels.max),
	)

	const toast = useToast()

	watch([() => error.value, () => data.value], async ([err]) => {
		try {
			if (!state.searchQuery.length) return

			if (err) {
				if (import.meta.dev) {
					console.error('Error fetching photos: ', err)
				}

				toast.add({
					title: `"${state.searchQuery}"搜尋失敗，請稍後再試。`,
				})

				return
			}

			await navigateTo({
				name: 'gallery-id',
				query: {
					search: state.searchQuery,
				} satisfies GalleryPageQuery,
			})
		} finally {
			state.isOpen = false
		}
	})

	const afterLeave = () => {
		if (state.searchQuery.length === 0) return

		records.add(state.searchQuery)

		state.searchValue = {} as CommandPaletteItem
		state.dynamicValue = state.searchQuery = ''
	}
</script>

<template>
	<UModal
		v-model:open="state.isOpen"
		:title="state.modal.title"
		:description="state.modal.description"
		:ui="{
			overlay: 'blur-sm',
		}"
		@after:leave="afterLeave"
	>
		<UDashboardSearchButton class="flex-none" :kbds="state.searchKbds" />
		<template #content>
			<div class="h-80">
				<LazyUCommandPalette
					v-model:model-value="state.searchValue"
					v-model:search-term="state.dynamicValue"
					hydrate-on-idle
					size="xl"
					class="h-full"
					:placeholder="state.placeholder"
					:loading="isFetching"
					:groups="groups"
					close
					:fuse="{
						fuseOptions: { includeMatches: true },
						matchAllWhenSearchEmpty: true,
					}"
					@update:open="state.isOpen = $event"
					@keyup.enter="search"
					@update:model-value="select($event)"
					@update:search-term="state.dynamicValue = $event"
				>
					<template #empty>沒有紀錄</template>
				</LazyUCommandPalette>
			</div>
		</template>
	</UModal>
</template>

<style lang="scss"></style>
