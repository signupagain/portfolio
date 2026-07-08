import { rectsIntersect, type Rect } from './rectGeometry'

export interface LayoutMetrics {
	paddingStart: number
	paddingLeft: number
	laneWidth: number
}

export interface VirtualGridLayoutOptions {
	lanes?: number
	gap?: number
	scrollMargin?: number
	count?: number
	estimateSize?: number | ((index: number) => number)
}

export interface IndexBounds {
	minRow: number
	maxRow: number
	minLane: number
	maxLane: number
}

export function getLayoutMetrics(
	containerEl: HTMLElement,
	lanes: number,
	gap: number,
): LayoutMetrics {
	const style = getComputedStyle(containerEl)
	const paddingStart = Number.parseFloat(style.paddingTop) || 0
	const paddingLeft = Number.parseFloat(style.paddingLeft) || 0
	const contentWidth =
		containerEl.clientWidth -
		paddingLeft -
		(Number.parseFloat(style.paddingRight) || 0)
	const laneWidth =
		lanes > 1 ? (contentWidth - (lanes - 1) * gap) / lanes : contentWidth

	return { paddingStart, paddingLeft, laneWidth }
}

export function getItemRectAtIndex(
	index: number,
	lanes: number,
	gap: number,
	itemSize: number,
	paddingStart: number,
	scrollMargin: number,
	paddingLeft: number,
	laneWidth: number,
): Rect {
	const row = Math.floor(index / lanes)
	const lane = index % lanes
	const rowStride = itemSize + gap

	return {
		top: paddingStart + scrollMargin + row * rowStride,
		left: paddingLeft + lane * (laneWidth + gap),
		width: laneWidth,
		height: itemSize,
	}
}

export function getIndexBoundsForSelection(
	selectionRect: Rect,
	lanes: number,
	gap: number,
	itemSize: number,
	paddingStart: number,
	scrollMargin: number,
	paddingLeft: number,
	laneWidth: number,
): IndexBounds {
	const itemTopOffset = paddingStart + scrollMargin
	const rowStride = itemSize + gap
	const laneStride = laneWidth + gap
	const selectionBottom = selectionRect.top + selectionRect.height
	const selectionRight = selectionRect.left + selectionRect.width

	return {
		minRow: Math.max(
			0,
			Math.ceil((selectionRect.top - itemTopOffset - itemSize) / rowStride),
		),
		maxRow: Math.floor((selectionBottom - itemTopOffset - 1) / rowStride),
		minLane: Math.max(
			0,
			Math.ceil((selectionRect.left - paddingLeft - laneWidth) / laneStride),
		),
		maxLane: Math.min(
			lanes - 1,
			Math.floor((selectionRight - paddingLeft - 1) / laneStride),
		),
	}
}

function resolveItemSize(
	estimateSize: VirtualGridLayoutOptions['estimateSize'],
	index: number,
	fallback: number,
): number {
	return typeof estimateSize === 'function' ? estimateSize(index) : fallback
}

export function getSelectedIdsInVirtualGrid<T extends { id: string }>(
	selectionRect: Rect,
	layout: VirtualGridLayoutOptions,
	metrics: LayoutMetrics,
	nodes: T[],
): T['id'][] {
	const lanes = layout.lanes ?? 1
	const gap = layout.gap ?? 0
	const scrollMargin = layout.scrollMargin ?? 0
	const count = layout.count ?? 0

	if (count !== nodes.length) return []
	if (selectionRect.width === 0 && selectionRect.height === 0) return []

	const { paddingStart, paddingLeft, laneWidth } = metrics
	const defaultItemSize =
		typeof layout.estimateSize === 'function' ?
			layout.estimateSize(0)
		:	(layout.estimateSize ?? 100)
	const { minRow, maxRow, minLane, maxLane } = getIndexBoundsForSelection(
		selectionRect,
		lanes,
		gap,
		defaultItemSize,
		paddingStart,
		scrollMargin,
		paddingLeft,
		laneWidth,
	)
	const ids: T['id'][] = []

	for (let row = minRow; row <= maxRow; row++) {
		for (let lane = minLane; lane <= maxLane; lane++) {
			const index = row * lanes + lane
			if (index >= nodes.length) break

			const itemSize = resolveItemSize(
				layout.estimateSize,
				index,
				defaultItemSize,
			)
			const itemRect = getItemRectAtIndex(
				index,
				lanes,
				gap,
				itemSize,
				paddingStart,
				scrollMargin,
				paddingLeft,
				laneWidth,
			)

			if (!rectsIntersect(selectionRect, itemRect)) continue

			const id = nodes[index]?.id
			if (id) ids.push(id)
		}
	}

	return ids
}
