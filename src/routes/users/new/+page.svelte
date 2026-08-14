<script lang="ts">
    import {goto} from "$app/navigation";
    import {createUser, ApiError} from "$lib/api";
    import type {CreateUserInput} from "$lib/types";

    let form: CreateUserInput = {
        fname: "",
        lname: "",
        username: "",
        password: "",
        email: "",
        avatar: ""
    };

    let submitting: boolean = $state(false);
    let error: string | null = $state(null);

    async function onSubmit() {
        submitting = true;
        error = null;
        try{
            const user = await createUser(form);
            await goto(`/users/${user.id}`);
        }catch(e){
            error = e instanceof ApiError ? e.message: 'Failed to create user.';
        }finally{
            submitting = false;
        }
    }
</script>

<svelte:head>
    <title>New User</title>
</svelte:head>

<div class="mx-auto max-w-lg">
    <div class="mb-6 flex items-center gap-2 text-sm">
        <a href="/" class="text-indigo-600 hover:underline">Users</a>
        <span class="text-slate-400">/</span>
        <span class="text-slate-600">New</span>
    </div>
    <h1 class="mb-6 text-2xl font-bold">Create a new user</h1>
    {#if error}
        <div class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
        </div>
    {/if}
    <form on:submit|preventDefault={onSubmit} class="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label for="fname" class="mb-1 block text-sm font-medium text-slate-700">First name</label>
				<input id="fname" required bind:value={form.fname}
					class="w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
			</div>
			<div>
				<label for="lname" class="mb-1 block text-sm font-medium text-slate-700">Last name</label>
				<input id="lname" required bind:value={form.lname}
					class="w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
			</div>
		</div>

		<div>
			<label for="username" class="mb-1 block text-sm font-medium text-slate-700">Username</label>
			<input id="username" required bind:value={form.username}
				class="w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
		</div>

		<div>
			<label for="password" class="mb-1 block text-sm font-medium text-slate-700">Password</label>
			<input id="password" type="password" required bind:value={form.password}
				class="w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
		</div>

		<div>
			<label for="email" class="mb-1 block text-sm font-medium text-slate-700">Email</label>
			<input id="email" type="email" required bind:value={form.email}
				class="w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
		</div>

		<div>
			<label for="avatar" class="mb-1 block text-sm font-medium text-slate-700">Avatar URL</label>
			<input id="avatar" type="url" required bind:value={form.avatar}
				placeholder="https://..."
				class="w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
		</div>

		<div class="flex justify-end gap-2 pt-2">
			<a href="/" class="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</a>
			<button
				type="submit"
				disabled={submitting}
				class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
			>
				{submitting ? 'Creating…' : 'Create User'}
			</button>
		</div>
	</form>
</div>