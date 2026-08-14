<script lang="ts">
    import {onMount} from 'svelte';
    import { page } from '$app/state';
    import {goto} from '$app/navigation';
    import {getUser, deleteUser, ApiError} from '$lib/api';
    import type { UserDetail } from '$lib/types';

    let user: UserDetail | null = $state(null);
    let loading: boolean = $state(true);
    let error: string | null = $state(null);
    let deleting: boolean = $state(false);
    const id: number = Number(page.params.id);

    async function load(){
        loading = true;
        error = null;

        try{
            user = await getUser(id);
        } catch (e) {
            error = e instanceof ApiError ? e.message : 'Failed to load user.';
        } finally {
            loading = false;
        }
    }
    async function onDelete() {
		if (!user) return;
		if (!confirm(`Delete user #${user.id}? This cannot be undone.`)) return;
		deleting = true;
		try {
			await deleteUser(user.id);
			await goto('/');
		} catch (e) {
			alert(e instanceof ApiError ? e.message : 'Failed to delete user.');
		} finally {
			deleting = false;
		}
	}

    onMount(load);
</script>

<svelte:head>
    <title>{user ? `${user.fname} ${user.lname}` : 'User'}</title>
</svelte:head>

<div class="mx-auto max-w-lg">
    <div class="mb-6 flex items-center gap-2 text-sm">
        <a href="/" class="text-indigo-600 hover:underline">Users</a>
        <span class="text-slate-400">/</span>
        <span class="text-slate-600">#{id}</span>
    </div>

    {#if loading}
        <p class="text-sm text-slate-500">Loading...</p>
    {:else if error}
        <div class="rounded-lg border border-slate-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
    {:else if user}
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div class="flex items-center gap-4">
                    <img src={user.avatar} alt="{user.fname} {user.lname}" class="h-16 w-16 rounded-full object-cover ring-1 ring-slate-200" />
                    <div>
                        <h1 class="text-xl font-bold">{user.fname} {user.lname}</h1>
                        <p class="text-sm text-slate-500">@{user.username}</p>
                    </div>
                </div>

                <dl class="mt-6 divide-y divide-slate-100 text-sm">
                    <div class="flex justify-between py-2">
                        <dt class="text-slate-500">ID</dt>
                        <dd class="font-medium text-slate-900">{user.id}</dd>
                    </div>
                    <div class="flex justify-between py-2">
                        <dt class="text-slate-500">Email</dt>
                        <dd class="font-medium text-slate-900">{user.email}</dd>
                    </div>
                </dl>

                <div class="mt-6 flex justify-end gap-2">
                    <a href="/users/{user.id}/edit" class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        Edit
                    </a>
                    <button
                        onclick={onDelete}
                        disabled={deleting}
                        class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
                    >
                        {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </div>
    {/if}
</div>