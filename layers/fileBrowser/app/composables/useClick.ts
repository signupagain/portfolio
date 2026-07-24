import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { useFileBrowserDataStore } from '../stores/useFileBrowserDataStore'
import type { DisplayedItem } from '../utils/toDisplayedItem'

export const useClick = (
	items: ComputedRef<(number | DisplayedItem)[]>,
	isAsideVisible: MaybeRefOrGetter<boolean>,
) => {
	const dataStore = useFileBrowserDataStore()
	const { displayedNodes, selectedItems, stack, drawerBtn } =
		storeToRefs(dataStore)

	const shiftAnchorIndex = ref(-1)

	watch(
		() => stack.value.length,
		() => {
			shiftAnchorIndex.value = -1
		},
	)

	async function clickBtn(event: PointerEvent, index: number) {
		const item = items.value[index]

		if (typeof item === 'number' || !item) return

		if (event.shiftKey) {
			if (shiftAnchorIndex.value === -1) {
				dataStore.pushSelectedItems(item.id)
			} else {
				let start: number, end: number

				if (shiftAnchorIndex.value > index) {
					start = index
					end = shiftAnchorIndex.value
				} else {
					start = shiftAnchorIndex.value
					end = index
				}

				dataStore.pushSelectedItems(
					displayedNodes.value.slice(start, end + 1).map((node) => node.id),
				)
			}

			shiftAnchorIndex.value = index
			return
		}

		shiftAnchorIndex.value = index

		if (event.ctrlKey) {
			if (selectedItems.value.has(item.id)) {
				dataStore.deleteSelectedItem(item.id)
				dataStore.clearActiveIfMissing()
			} else {
				dataStore.pushSelectedItems(item.id)
			}

			return
		}

		if (item.type === 'file') {
			dataStore.clearSelectedItems()
			dataStore.pushSelectedItems(item.id)
			dataStore.setActiveItem(item.id)

			if (!toValue(isAsideVisible)) {
				const btn = ((event.target as HTMLElement | null)?.closest(
					'[data-index]',
				) ?? event.currentTarget) as HTMLElement

				btn.blur()
				drawerBtn.value = btn
			}
		} else {
			dataStore.moveToNode(item.id)
		}
	}

	function contextSelect(index: number) {
		const item = items.value[index]

		if (typeof item === 'number' || !item) return

		shiftAnchorIndex.value = index

		if (selectedItems.value.has(item.id)) return

		dataStore.clearSelectedItems()
		dataStore.pushSelectedItems(item.id)

		if (item.type === 'file') {
			dataStore.setActiveItem(item.id)
		} else {
			dataStore.deleteActiveItem()
		}
	}

	function clearState() {
		shiftAnchorIndex.value = -1
		dataStore.clearSelectedItems()
		dataStore.deleteActiveItem()
	}

	return {
		clickBtn,
		contextSelect,
		clearState,
	}
}
