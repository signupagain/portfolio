<script setup lang="ts">
	import { useFileBrowserDataStore } from '../../stores/useFileBrowserDataStore'
	import type { DisplayedItem } from '../../utils/toDisplayedItem'
	import type { ContextMenuItem } from '@nuxt/ui'

	const props = defineProps<{
		isAsideVisible: boolean
	}>()

	const dataStore = useFileBrowserDataStore()
	const {
		displayedNodes,
		fileCategoryMap,
		selectedItems,
		selectedItemsCount,
		layout,
	} = storeToRefs(dataStore)

	defineShortcuts({
		ctrl_a: () => {
			dataStore.pushSelectedItems(displayedNodes.value.map((entry) => entry.id))
		},
		Delete: deleteSelectedItems,
	})

	const scrollArea = useTemplateRef('scroll')
	const { width: scrollAreaWidth } = useElementSize(() => scrollArea.value?.$el)

	const lanes = computed(() => {
		if (layout.value === 'list') {
			return 1
		}

		return Math.max(1, Math.round(scrollAreaWidth.value / 125))
	})

	const isLoaded = ref(false)

	const skeletonWidths = useState('file-browser-skeleton-widths', () =>
		Array.from({ length: 100 }, () =>
			Math.min(80, Math.max(40, Math.trunc(Math.random() * 101))),
		),
	)

	onMounted(async () => {
		isLoaded.value = await dataStore.initialize()
	})

	const items = computed<(number | DisplayedItem)[]>(() =>
		!isLoaded.value ?
			skeletonWidths.value
		:	displayedNodes.value.map((entry) =>
				toDisplayedItem(
					entry,
					fileCategoryMap.value.get(entry.extension ?? '')!,
					{
						active:
							selectedItems.value.has(entry.id) ||
							areaSelectedItems.value.has(entry.id),
					},
				),
			),
	)

	const { clickBtn, openItem, enterItem, contextSelect, clearState } =
		useItemInteraction(items, () => props.isAsideVisible)

	const { areaSelectedItems, consumeDidSwipe } = useAreaSelection(
		() => scrollArea,
	)

	useItemPointerEvents(() => scrollArea, {
		onItemClick: clickBtn,
		onItemDblClick: (_event, index) => openItem(index),
		onItemContextMenu: contextSelect,
		onItemEnter: enterItem,
		onClear: clearState,
		shouldSuppressClick: consumeDidSwipe,
	})

	const contextMenuItem = computed<ContextMenuItem[][]>(() => [
		[
			{
				label: '刪除已選檔案',
				icon: 'i-lucide:circle-x',
				color: 'warning',
				disabled: selectedItemsCount.value < 1,
				onSelect: deleteSelectedItems,
			},
		],
	])

	function deleteSelectedItems() {
		if (selectedItemsCount.value < 1) return

		dataStore.deleteNodes()
		clearState()
	}
</script>

<template>
	<UContextMenu :items="contextMenuItem">
		<UScrollArea
			v-slot="{ item, index }"
			ref="scroll"
			as="main"
			:items="items"
			:virtualize="{
				lanes,
				gap: 16,
				skipMeasurement: true,
				overscan: 5,
				estimateSize() {
					return layout === 'grid' ? 100 : 52
				},
				getItemKey(index) {
					return typeof items[index] === 'number' ? index : items[index]!.id!
				},
			}"
			:ui="{
				root: 'p-4 scrollbar-thin',
				viewport: 'text-center @container',
				item: 'text-center',
			}"
		>
			<div
				v-if="typeof item === 'number'"
				class="flex"
				:class="
					layout === 'grid' ?
						'h-25 flex-col items-center justify-center gap-2'
					:	'h-13'
				"
			>
				<USkeleton class="size-8" />
				<div class="flex w-full flex-col items-center gap-2">
					<USkeleton class="h-2.5" :style="{ width: item + '%' }" />
					<USkeleton class="h-2.5 w-1/3" />
				</div>
			</div>
			<UButton
				v-else
				color="neutral"
				:variant="item.active ? 'solid' : 'ghost'"
				:data-index="index"
				:ui="{
					base: 'w-full',
				}"
			>
				<div
					v-if="layout === 'list'"
					class="flex min-w-0 flex-1 items-center gap-4"
				>
					<UIcon
						:name="'i-lucide-' + item.icon"
						class="size-6.5"
						:class="iconColorMap[item.color]"
					/>
					<div class="flex min-w-0 flex-1 flex-col text-start">
						<strong class="truncate">{{ item.title }}</strong>
						<p class="truncate">{{ item.description }}</p>
					</div>
					<p
						class="hidden flex-none items-center justify-between text-end @md:flex"
					>
						<span class="min-w-36">{{ item.modified }}</span>
						<span class="min-w-24">{{ item.size }}</span>
					</p>
				</div>
				<div v-else class="flex min-w-0 flex-1 flex-col items-center gap-2">
					<UIcon
						:name="'i-lucide-' + item.icon"
						class="size-8"
						:class="iconColorMap[item.color]"
					/>
					<h2 class="w-full truncate">{{ item.title }}</h2>
					<span class="h-5 w-full truncate">{{
						item.type === 'file' ? item.size : ''
					}}</span>
				</div>
			</UButton>
		</UScrollArea>
	</UContextMenu>
</template>

<style lang="scss"></style>
