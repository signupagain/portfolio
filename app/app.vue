<script setup lang="ts">
	useHead({
		htmlAttrs: {
			lang: 'zh-Hant-TW',
			class:
				'scrollbar-thin scrollbar-thumb-(--ui-text-muted) scrollbar-track-(--ui-bg-muted)',
		},
	})
</script>

<template>
	<UApp>
		<NuxtRouteAnnouncer />
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>
