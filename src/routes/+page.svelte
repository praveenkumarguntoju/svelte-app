<script lang="ts">
	export let data;

    let serverConfig = data.serverConfig;
	import RoleEditor from './RoleEditor.svelte';

	let selectedRoleName = serverConfig.selected_role;
	let selectedRole = serverConfig.roles[selectedRoleName];

	function selectRole(roleName: string) {
		selectedRoleName = roleName;
		selectedRole = (serverConfig.roles as Record<string, any>)[roleName];
	}

	function updateRoleField(key: keyof typeof selectedRole, value: any) {
		selectedRole[key] = value;
	}
</script>

<div class="flex min-h-screen gap-6 bg-gray-100 p-6">
	<!-- Sidebar: List of roles -->
	<aside class="w-1/4 rounded-lg bg-white p-4 shadow">
		<h2 class="mb-4 text-xl font-semibold">Roles</h2>
		<ul class="space-y-2">
			{#each Object.entries(serverConfig.roles) as [roleName, role]}
				<li>
					<button
						on:click={() => selectRole(roleName)}
						class="w-full rounded-md px-3 py-2 text-left transition
							{selectedRoleName === roleName ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-100'}"
					>
						{role.name}
					</button>
				</li>
			{/each}
		</ul>
	</aside>

	<!-- Main content: Editable role details -->
	<main class="flex-1 rounded-lg bg-white p-6 shadow">
		<h2 class="mb-4 text-2xl font-bold">Edit Role: {selectedRole.name}</h2>

		<RoleEditor role={selectedRole} onUpdate={(key, value) => updateRoleField(key, value)} />
	</main>
</div>
