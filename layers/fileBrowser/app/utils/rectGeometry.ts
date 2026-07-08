export interface Rect {
	top: number
	left: number
	width: number
	height: number
}

export interface PendingRect {
	currentX: number
	currentY: number
	startX: number
	startY: number
}

export function rectsIntersect(a: Rect, b: Rect): boolean {
	return (
		a.left < b.left + b.width &&
		a.left + a.width > b.left &&
		a.top < b.top + b.height &&
		a.top + a.height > b.top
	)
}

export function selectionRectFromPoints(
	start: readonly [number, number],
	end: readonly [number, number],
): Rect {
	const [startX, startY] = start
	const [endX, endY] = end

	return {
		top: Math.min(startY, endY),
		left: Math.min(startX, endX),
		width: Math.abs(endX - startX),
		height: Math.abs(endY - startY),
	}
}

export function applyPendingRectToElement(
	element: HTMLElement,
	{ currentX, currentY, startX, startY }: PendingRect,
): void {
	element.style.left = `${Math.min(currentX, startX)}px`
	element.style.top = `${Math.min(currentY, startY)}px`
	element.style.width = `${Math.abs(currentX - startX)}px`
	element.style.height = `${Math.abs(currentY - startY)}px`
}
