<script setup lang="ts">
	import type { InferContractRouterOutputs } from '@orpc/contract'
	import { useImage, type UseImageOptions } from '@vueuse/core'

	type Output = InferContractRouterOutputs<
		typeof pexelsContracts.client.getPhoto
	>

	const { data } = defineProps<{
		data: Output
	}>()

	const route = useRoute('gallery-id')
	const previousRoute = usePreviousRouteName()

	if (route.name !== 'gallery-id') {
		throw createError(
			'GalleryCard should only be used on the "gallery-id" page',
		)
	}

	const id = computed(() => +(route.params.id || NaN))

	const srcOptions = computed<UseImageOptions>((old) =>
		isNaN(id.value) && old ? old : { src: data.src.large },
	)

	const { isReady, isLoading, error } = useImage(srcOptions)

	const isOpen = ref(false)

	watchEffect(() => {
		isOpen.value = !isNaN(id.value) && isReady.value
	})

	const toast = useToast()

	watchEffect(() => {
		const id = 'loading-img'

		if (isLoading.value) {
			toast.add({
				id,
				title: '圖片加載中...',
			})
		} else {
			setTimeout(() => {
				toast.remove(id)
			}, 800)
		}
	})

	const srcset = computed<string>((oldSrc) =>
		isNaN(id.value) && oldSrc ? oldSrc : (
			`${data.src.large} 1x, ${data.src.large2x} 2x`
		),
	)

	const aspectRatio = computed<number>((oldRatio) =>
		isNaN(id.value) && oldRatio ? oldRatio : (
			Math.round((data.width / data.height) * 1000) / 1000
		),
	)

	watch(
		() => error.value,
		async (payload) => {
			if (import.meta.env.DEV) {
				console.error(`Image ${id.value} failed to load:`, payload)
			}

			await navigateTo({ name: previousRoute.value ?? 'gallery-id' })
		},
	)
</script>

<template>
	<LazyUModal
		:id="`photo-modal-${id}`"
		:open="isOpen"
		scrollable
		:title="data.alt"
		description=""
		@update:open="
			(e) => {
				if (!e) return navigateTo({ name: previousRoute ?? 'gallery-id' })
			}
		"
	>
		<template #title>
			<div class="flex w-full items-center justify-between">
				<h2 class="max-w-90 truncate">
					{{ data.photographer }}
				</h2>
				<UButton
					aria-label="Navigate to image source."
					:to="data.url"
					target="_blank"
					variant="ghost"
					color="neutral"
					icon="lucide:link"
					size="xs"
					:ui="{
						base: 'ml-auto',
					}"
				/>
			</div>
		</template>
		<template #body>
			<img
				:id="id.toString()"
				:src="data.src.large2x"
				:srcset="srcset"
				:alt="data.alt"
				class="block w-full"
				:style="{
					aspectRatio,
				}"
			/>
		</template>
	</LazyUModal>
</template>

<style lang="scss"></style>
