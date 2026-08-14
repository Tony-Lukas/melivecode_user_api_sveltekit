<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { goto } from '$app/navigation';
    import {getUser, updateUser, ApiError} from '$lib/api' 
    import {type UpdateUserInput} from '$lib/types';

    const id: number = Number(page.params.id);

    let form: UpdateUserInput = {
        fname: '',
        lname: '',
        username: '',
        email: '',
        avatar: '',
    }
    let loading: boolean = $state(true);
    let submitting: boolean = $state(false);
    let error: string|null = null;

    async function load() {
        loading = true;
        error = null;
         try{
            const user = await getUser(id);
            form = {
                fname: user.fname,
                lname: user.lname,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            };
         }catch (e) {
            error = e instanceof ApiError ? e.message: 'Fail to load user';
         } finally{
            loading = false;
         }
    }

    async function onSubmit(){
        submitting = true;
        error = null;

        try{
            const payload: UpdateUserInput = {...form};
            if (!payload.password) delete payload.password;
            await updateUser(id, payload);
            await goto(`/users/${id}`);
        } catch (e){
            error = e instanceof ApiError ? e.message: 'Fail to update user';
        } finally{
            submitting = false;
        }
    }
    onMount(load);
</script>


<svelte:head>
	<title>Edit User</title>
</svelte:head>

<div class="mx-auto max-w-lg">
	<div class="mb-6 flex items-center gap-2 text-sm">
		<a href="/" class="text-indigo-600 hover:underline">Users</a>
		<span class="text-slate-400">/</span>
		<a href="/users/{id}" class="text-indigo-600 hover:underline">#{id}</a>
		<span class="text-slate-400">/</span>
		<span class="text-slate-600">Edit</span>
	</div>

	<h1 class="mb-6 text-2xl font-bold">Edit user #{id}</h1>

	{#if loading}
		<p class="text-sm text-slate-500">Loading…</p>
	{:else}
		{#if error}
			<div class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
				{error}
			</div>
		{/if}

		<form on:submit|preventDefault={onSubmit} class="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="fname" class="mb-1 block text-sm font-medium text-slate-700">First name</label>
					<input id="fname" bind:value={form.fname}
						class="w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
				</div>
				<div>
					<label for="lname" class="mb-1 block text-sm font-medium text-slate-700">Last name</label>
					<input id="lname" bind:value={form.lname}
						class="w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
				</div>
			</div>

			<div>
				<label for="username" class="mb-1 block text-sm font-medium text-slate-700">Username</label>
				<input id="username" bind:value={form.username}
					class="w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
			</div>

			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-slate-700">
					Password <span class="text-slate-400">(leave blank to keep current)</span>
				</label>
				<input id="password" type="password" bind:value={form.password}
					class="w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
			</div>

			<div>
				<label for="email" class="mb-1 block text-sm font-medium text-slate-700">Email</label>
				<input id="email" type="email" bind:value={form.email}
					class="w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
			</div>

			<div>
				<label for="avatar" class="mb-1 block text-sm font-medium text-slate-700">Avatar URL</label>
				<input id="avatar" type="url" bind:value={form.avatar}
					class="w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
			</div>

			<div class="flex justify-end gap-2 pt-2">
				<a href="/users/{id}" class="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</a>
				<button
					type="submit"
					disabled={submitting}
					class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
				>
					{submitting ? 'Saving…' : 'Save Changes'}
				</button>
			</div>
		</form>
	{/if}
</div>
