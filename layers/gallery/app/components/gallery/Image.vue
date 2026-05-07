<script setup lang="ts">
	import type { InferContractRouterOutputs } from '@orpc/contract'
	import { useImage } from '@vueuse/core'

	type SrcType = InferContractRouterOutputs<
		| typeof pexelsContracts.client.curatedPhotos
		| typeof pexelsContracts.client.searchPhotos
	>['photos'][number]['src']

	/**
	 * References
	 * - https://www.pexels.com/api/documentation/?language=javascript
	 * - https://docs.imgix.com/en-US/apis/rendering/overview
	 *
	 * type PexelsSupportedImgixAPI = {
	 * 	dpr: 1 | 2 | 3 // use NuxtImg's "densities" prop instead
	 * 	h: number
	 * 	w: number
	 * 	fit: 'crop'
	 * 	auto: 'compress' | 'enhance' | 'true' | 'format' | 'redeye' // use fixed "auto" param instead
	 * }
	 */

	export type GalleryImageProps = {
		id: number
		width: number
		height: number
		alt: string
		src: SrcType
		avgColor: string
		loading?: 'eager' | 'lazy'
	}

	const {
		id,
		width,
		height,
		alt,
		src,
		avgColor,
		loading = 'lazy',
	} = defineProps<GalleryImageProps>()

	const aspectRatio = computed(() => width / height)

	const isExist = defineModel<boolean>('isExist', {
		default: true,
		validator: (value) => typeof value === 'boolean',
	})

	const { isReady: smallReady } = useImage({
		src: src.small,
	})

	const { isReady, isLoading, error } = useImage({ src: src.large })

	watch(
		() => error.value,
		(payload) => {
			if (import.meta.env.DEV) {
				console.error(`Image ${id} failed to load:`, payload)
			}

			isExist.value = false
		},
	)
</script>

<template>
	<div
		:id="id.toString()"
		class="overflow-hidden"
		:style="{
			aspectRatio,
			backgroundColor: avgColor,
		}"
	>
		<img
			v-if="isReady"
			:id="id.toString()"
			:loading="loading"
			:src="src.large"
			:alt="alt"
			:width="width"
			:height="height"
			class="block size-full"
			:style="{
				aspectRatio,
			}"
		/>
		<img
			v-if="smallReady && isLoading"
			:loading="loading"
			:src="src.small"
			:alt="alt"
			class="block size-full blur-xs"
			:style="{
				aspectRatio,
			}"
		/>
	</div>
</template>

<style lang="scss"></style>
