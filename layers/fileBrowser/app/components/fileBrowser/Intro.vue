<script setup lang="ts">
	const isOpen = ref(true)

	const toggle = () => (isOpen.value = !isOpen.value)

	defineExpose({ toggle })

	const { data: page } = await useFetch('/api/fileBrowser/intro')

	if (!page.value) {
		const appConfig = useAppConfig()
		throw createError(appConfig.error.notFound)
	}
</script>

<template>
	<UModal
		v-if="page"
		v-model:open="isOpen"
		:title="page.title"
		description=""
		scrollable
	>
		<template #content>
			<div class="relative">
				<ContentRenderer :value="page.body" />
				<UButton
					aria-label="關閉彈窗"
					icon="lucide:x"
					size="xl"
					color="neutral"
					variant="ghost"
					class="absolute top-4 right-4"
					@click="
						() => {
							isOpen = false
						}
					"
				/>
			</div>
		</template>
	</UModal>
</template>

<style lang="scss"></style>
