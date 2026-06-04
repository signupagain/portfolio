<script setup lang="ts">
	const { data: page } = await useFetch('/api/project')
	const { data: projects } = await useFetch('/api/projects')

	if (!page.value || !projects.value) {
		const appConfig = useAppConfig()
		throw createError(appConfig.error.notFound)
	}

	useSeoMeta({
		title: page.value?.seo.title || page.value?.title,
		ogTitle: page.value?.seo.title || page.value?.title,
		description: page.value?.seo.description || page.value?.description,
		ogDescription: page.value?.seo.description || page.value?.description,
	})

	preloadRouteComponents('/file-browser')
</script>

<template>
	<UPage v-if="page" as="main">
		<UPageHero
			:title="page.title"
			:description="page.description"
			:ui="{
				title: 'mx-0! text-left',
				description: 'mx-0! text-left text-pretty',
			}"
		/>
		<UPageSection
			:ui="{
				container: 'pt-0!',
			}"
		>
			<Motion
				v-for="(project, index) in projects"
				:key="project.title"
				:initial="{ opacity: 0, transform: 'translateY(10px)' }"
				:while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
				:transition="{ delay: 0.2 * index }"
				:in-view-options="{ once: true }"
			>
				<UPageCard
					:title="project.title"
					:description="project.description"
					:to="project.url"
					orientation="horizontal"
					variant="naked"
					:reverse="index % 2 === 1"
					class="group"
					:ui="{
						wrapper: 'max-sm:order-last',
					}"
				>
					<template #footer>
						<ULink
							:to="project.url"
							class="text-primary flex items-center text-sm"
						>
							View Project
							<UIcon
								name="i-lucide-arrow-right"
								class="text-primary size-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
							/>
						</ULink>
					</template>
					<NuxtImg
						:src="project.image"
						:alt="project.title"
						placeholder
						class="h-48 w-full rounded-lg object-cover ring"
					/>
				</UPageCard>
			</Motion>
		</UPageSection>
	</UPage>
</template>

<style lang="scss"></style>
