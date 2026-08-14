<script lang="ts">
    import {onMount} from 'svelte';
    import {listUsers, deleteUser, ApiError} from "$lib/api";
    import type {User, PaginatedUsers} from "$lib/types";

    let users: User[] = $state([]);
    let loading:boolean = $state(true);
    let error: string | null = $state(null);

    let search = $state('');
    let sortColumn: 'id' | 'fname' | 'lname' | 'username' = $state('id');
    let sortOrder: 'asc' | 'desc' = $state('asc');
    let page: number = $state(1);
    let perPage: number = $state(10);

    let total: number = $state(0);
    let totalPages: number = $state(1);

    let deletingId: number | null = $state(null);

    function isPaginated(res:User[] | PaginatedUsers): res is PaginatedUsers{
        return !Array.isArray(res) && 'data' in res;
    }

    async function load(){
        loading = true;
        error = null;

        try{
            const res = await listUsers({
                search: search || undefined,
                page,
                per_page:perPage,
                sort_columns: sortColumn,
                sort_order: sortOrder
            });

            if (isPaginated(res)) {
                users = res.data;
                total = res.total;
                totalPages = res.total_pages;
            } else {
                users = res;
                total = res.length;
                totalPages = 1;
            }
        } catch(e) {
            error = e instanceof ApiError ? e.message : 'Failed to load users.';
        } finally {
            loading = false;
        }
    }

    function onSearchInput(){
        page=1;
        load();
    }

    function toggleSort(column: typeof sortColumn) {
        if(sortColumn === column){
            sortOrder = sortOrder === 'asc' ? 'desc': 'asc';
        } else {
            sortColumn = column;
            sortOrder = 'asc';
        }
        load();
    }

    function goToPage(p:number){
        if(p<1 || p> totalPages) return;
        page = p;
        load();
    }

    async function onDelete(id:number){
        if(!confirm(`Delete user #${id}? This cannot be undone.`)) return;
        deletingId = id;
        try{
            await deleteUser(id);
            await load();
        } catch (e) {
            alert(e instanceof ApiError ? e.message : 'Failed to delete user.');
        } finally {
            deletingId = null;
        }
    }

    onMount(load);
</script>

<svelte:head>
    <title>Users</title>
</svelte:head>

<div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <h1 class="text-2xl font-bold">Users</h1>
    <input type="text" 
        bind:value={search}
        oninput={onSearchInput}
        placeholder="Search users..."
        class="w-full rounded-lg border-slate-300 text-sm"
    />
</div>

{#if error}
    <div class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
    </div>
{/if}

<div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
            <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Avatar
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <button class="flex items-center gap-1 hover:text-slate-800" onclick={() => toggleSort('id')}>
                        ID {sortColumn === 'id' ? (sortOrder === 'asc' ? '^':"v"):""}
                    </button>
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <button class="flex items-center gap-1 hover:text-slate-800" onclick={() => toggleSort('fname')}>
                        First Name {sortColumn === 'fname' ? (sortOrder === 'asc' ? '^':"v"):""}
                    </button>
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <button class="flex items-center gap-1 hover:text-slate-800" onclick={() => toggleSort('lname')}>
                        Last Name {sortColumn === 'lname' ? (sortOrder === 'asc' ? '^':"v"):""}
                    </button>
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <button class="flex items-center gap-1 hover:text-slate-800" onclick={() => toggleSort('username')}>
                        Username {sortColumn === 'username' ? (sortOrder === 'asc' ? '^':"v"):""}
                    </button>
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                </th>
            </tr>
        </thead>
        <tbody class="divide-y divide-salte-100">
            {#if loading}
                <tr>
                    <td colspan="6" class="px-4 py-8 text-center text-sm text-slate-500">Loading users...</td>
                </tr>
            {:else if users.length === 0}
                 <tr>
                    <td colspan="6" class="px-4 py-8 text-center text-sm text-slate-500">No users found.</td>
                </tr>
            {:else}
                {#each users as user (user.id)}
					<tr class="hover:bg-slate-50">
						<td class="px-4 py-3">
							<img
								src={user.avatar}
								alt="{user.fname} {user.lname}"
								class="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200"
								loading="lazy"
							/>
						</td>
						<td class="px-4 py-3 text-sm text-slate-500">#{user.id}</td>
						<td class="px-4 py-3 text-sm font-medium text-slate-900">{user.fname}</td>
						<td class="px-4 py-3 text-sm text-slate-700">{user.lname}</td>
						<td class="px-4 py-3 text-sm text-slate-700">{user.username}</td>
						<td class="px-4 py-3 text-right text-sm">
							<div class="flex justify-end gap-2">
								<a href="/users/{user.id}" class="rounded-md px-2 py-1 text-indigo-600 hover:bg-indigo-50">
									View
								</a>
								<a href="/users/{user.id}/edit" class="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100">
									Edit
								</a>
								<button
									onclick={() => onDelete(user.id)}
									disabled={deletingId === user.id}
									class="rounded-md px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
								>
									{deletingId === user.id ? 'Deleting…' : 'Delete'}
								</button>
							</div>
						</td>
					</tr>
				{/each}
            {/if}
        </tbody>
    </table>
</div>


{#if totalPages > 1}
	<div class="mt-4 flex items-center justify-between text-sm text-slate-600">
		<span>Page {page} of {totalPages} · {total} users</span>
		<div class="flex gap-2">
			<button
				onclick={() => goToPage(page - 1)}
				disabled={page <= 1}
				class="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-100 disabled:opacity-50"
			>
				Previous
			</button>
			<button
				onclick={() => goToPage(page + 1)}
				disabled={page >= totalPages}
				class="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-100 disabled:opacity-50"
			>
				Next
			</button>
		</div>
	</div>
{/if}
