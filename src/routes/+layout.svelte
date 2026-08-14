<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="min-h-screen bg-slate-50 text-slate-900">
	<header class="border-b border-slate-200 bg-white">
		<div class="mx-auto flex mas-w-5xl items-center justify-between px-4 py-4">
			<a href="/" class="text-lg font-semibold tracking-tight text-slate-900">MeLiveCode</a>
			<a href="/users/new" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm fount-medium text-white shadow-sm hover:bg-indigo-500">
				+New User
			</a>
		</div>
	</header>
	<main class="mx-auto max-w-5xl px-4 py-8">
		{@render children()}
	</main>
</div>

