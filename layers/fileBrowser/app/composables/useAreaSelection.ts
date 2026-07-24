import type { ShallowRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import type { UScrollArea } from '#components'
import { useFileBrowserDataStore } from '../stores/useFileBrowserDataStore'
import {
	applyPendingRectToElement,
	selectionRectFromPoints,
	type PendingRect,
} from '../utils/rectGeometry'
import {
	getLayoutMetrics,
	getSelectedIdsInVirtualGrid,
} from '../utils/virtualGridSelection'

type AreaSelectionPosition = [x: number, y: number] | null

export const useAreaSelection = (
	getTarget: () => ShallowRef<ComponentExposed<typeof UScrollArea> | null>,
) => {
	const dataStore = useFileBrowserDataStore()
	const { displayedNodes } = storeToRefs(dataStore)

	const areaSelectionRef = shallowRef<HTMLElement | null>(null)
	const pendingAreaSelectionRect = shallowRef<PendingRect | null>(null)
	const areaSelectionStart = ref<AreaSelectionPosition>(null)
	const areaSelectionEnd = ref<AreaSelectionPosition>(null)
	const areaSelectedItems = shallowRef<Set<Item['id']>>(new Set())
	const didSwipe = ref(false)

	const createOverlay = () => {
		const target = getTarget()?.value?.$el
		if (!target) return

		const overlay = document.createElement('div')
		overlay.style.position = 'absolute'
		overlay.style.border = '1px solid #555B66'
		overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.04)'

		target.appendChild(overlay)
		areaSelectionRef.value = overlay
	}

	const removeOverlay = () => {
		if (!areaSelectionRef.value) return

		areaSelectionRef.value.remove()
		areaSelectionRef.value = null
	}

	onUnmounted(removeOverlay)

	const { resume: resumeAreaSelectionPaint, pause: pauseAreaSelectionPaint } =
		useRafFn(
			() => {
				const rect = pendingAreaSelectionRect.value
				if (!areaSelectionRef.value || !rect) return

				applyPendingRectToElement(areaSelectionRef.value, rect)
			},
			{ immediate: false, once: true },
		)

	function getContainerPosition(event: {
		clientX: number
		clientY: number
	}): AreaSelectionPosition {
		const scrollOffset = getTarget()?.value?.virtualizer?.scrollOffset || 0
		const containerEl = getTarget()?.value?.$el
		if (!containerEl) return null

		const containerRect = containerEl.getBoundingClientRect()

		return [
			event.clientX - containerRect.left,
			event.clientY - containerRect.top + scrollOffset,
		]
	}

	function resolveSelectedItemIds(): Item['id'][] {
		const virtualizer = getTarget()?.value?.virtualizer
		const containerEl = getTarget()?.value?.$el

		if (
			!virtualizer ||
			!containerEl ||
			!areaSelectionStart.value ||
			!areaSelectionEnd.value
		) {
			return []
		}

		const selectionRect = selectionRectFromPoints(
			areaSelectionStart.value,
			areaSelectionEnd.value,
		)
		const { lanes = 1, gap = 0 } = virtualizer.options

		return getSelectedIdsInVirtualGrid(
			selectionRect,
			virtualizer.options,
			getLayoutMetrics(containerEl, lanes, gap),
			displayedNodes.value,
		)
	}

	function syncPendingSelection() {
		areaSelectedItems.value = new Set(resolveSelectedItemIds())
	}

	function updateAreaSelectionRect(
		currentX: number,
		currentY: number,
		startX: number,
		startY: number,
	) {
		areaSelectionEnd.value = [currentX, currentY]
		syncPendingSelection()
		pendingAreaSelectionRect.value = { currentX, currentY, startX, startY }
		resumeAreaSelectionPaint()
	}

	function commitAreaSelection() {
		if (areaSelectedItems.value.size === 0) return

		dataStore.pushSelectedItems([...areaSelectedItems.value])
	}

	function resetSelection() {
		pauseAreaSelectionPaint()
		pendingAreaSelectionRect.value = null
		areaSelectionStart.value = null
		areaSelectionEnd.value = null
		areaSelectedItems.value = new Set()
		removeOverlay()
	}

	/** Read and clear the swipe flag so a following click can be suppressed once. */
	function consumeDidSwipe() {
		const value = didSwipe.value
		didSwipe.value = false
		return value
	}

	usePointerSwipe(() => getTarget().value?.$el, {
		threshold: 5,
		pointerTypes: ['mouse'],
		disableTextSelect: true,
		onSwipeStart() {
			didSwipe.value = false
		},
		onSwipe(event) {
			didSwipe.value = true

			if (!areaSelectionStart.value) {
				createOverlay()

				const startPos = getContainerPosition(event)
				if (!startPos) return

				areaSelectionStart.value = startPos
			}

			const currentPos = getContainerPosition(event)
			if (!currentPos || !areaSelectionStart.value) return

			const [startX, startY] = areaSelectionStart.value
			updateAreaSelectionRect(currentPos[0], currentPos[1], startX, startY)
		},
		onSwipeEnd() {
			commitAreaSelection()
			resetSelection()
		},
	})

	return {
		areaSelectedItems: readonly(areaSelectedItems),
		consumeDidSwipe,
	}
}
