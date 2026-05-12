<script setup lang="ts">
	export type SpeedDialsProps = {
		dials?: Array<{
			icon: string
			label: string
			onClick: (e: MouseEvent) => void | Promise<void>
		}>
	}

	const { dials = [] } = defineProps<SpeedDialsProps>()

	const router = useRouter()

	const defaultButtons: SpeedDialsProps['dials'] = [
		{
			icon: 'lucide:house',
			label: '回到主頁',
			onClick: () => {
				router.push({ name: 'projects' })
			},
		},
	]

	const buttons = ref<Required<SpeedDialsProps>['dials']>()

	watch(
		() => dials.map(({ icon }) => icon).join(),
		() => {
			buttons.value = dials.slice().concat(defaultButtons)
		},
		{ immediate: true },
	)

	const isOpen = ref(false)
</script>

<template>
	<UPopover
		v-model:open="isOpen"
		:ui="{
			content: 'bg-transparent! ring-0',
		}"
	>
		<UButton
			icon="lucide:cog"
			aria-label="快捷鍵"
			color="primary"
			class="fixed right-15 bottom-6 z-9999 rounded-full"
			:ui="{
				leadingIcon: 'size-12',
			}"
		/>
		<template #content>
			<div class="flex flex-col gap-4" @click="isOpen = !isOpen">
				<UButton
					v-for="{ icon, label, onClick } in buttons"
					:key="icon"
					:icon="icon"
					:aria-label="label"
					color="primary"
					class="rounded-full"
					:ui="{
						leadingIcon: 'size-10',
					}"
					@click="onClick"
				/>
			</div>
		</template>
	</UPopover>
</template>

<style lang="scss"></style>
