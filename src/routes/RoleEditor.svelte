<script lang="ts">
	import { onMount } from "svelte";
	import type { Role } from "$lib/model";
	// import { saveRoleToAtomic } from "$lib/saveRoleToAtomic";

	// Shoelace components
	onMount(async () => {
		await import ("@shoelace-style/shoelace/dist/components/input/input.js");
		await import ("@shoelace-style/shoelace/dist/components/select/select.js");
		await import ("@shoelace-style/shoelace/dist/components/option/option.js");
		await import ("@shoelace-style/shoelace/dist/components/checkbox/checkbox.js");
		await import ("@shoelace-style/shoelace/dist/components/button/button.js");
	});

	export let role: Role;
	export let onUpdate: (key: keyof Role, value: any) => void;

	let saving = false;

	async function handleSave() {
		saving = true;
		try {
			const res = await fetch("/api/saveRole", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(role),
			});

			const result = await res.json();

			if (res.ok && result.success) {
				alert("✅ Saved!");
			} else {
				alert("❌ Save failed: " + result.error);
			}
		} catch (e) {
			console.error("❌ Save error:", e);
			alert("❌ Save failed: Unexpected error");
		}
		saving = false;
	}

	function updateHaystack(
		index: number,
		field: "path" | "service",
		value: string,
	) {
		role.haystacks[index][field] = value;
		onUpdate("haystacks", [...role.haystacks]);
	}

	function updateKGField(field: string, value: string | boolean) {
		const kg = role.kg || {
			automata_path: { Remote: "" },
			knowledge_graph_local: { input_type: "", path: "" },
			public: false,
			publish: false,
		};
		if (field === "Remote") kg.automata_path.Remote = value as string;
		if (field === "input_type")
			kg.knowledge_graph_local.input_type = value as string;
		if (field === "local_path")
			kg.knowledge_graph_local.path = value as string;
		if (field === "public") kg.public = value as boolean;
		if (field === "publish") kg.publish = value as boolean;

		onUpdate("kg", { ...kg });
	}
</script>

<div class="space-y-6">
	<!-- Role Fields -->
	<sl-input
		label="Role Name"
		value={role?.name}
		on:sl-input={(e) => onUpdate("name", e.target.value)}
	/>
	<sl-input
		label="Shortname"
		value={role?.shortname}
		on:sl-input={(e) => onUpdate("shortname", e.target.value)}
	/>
	<sl-input
		label="Relevance Function"
		value={role?.relevance_function}
		on:sl-input={(e) => onUpdate("relevance_function", e.target.value)}
	/>

	<sl-select
		label="Theme"
		value={role?.theme}
		on:sl-change={(e) => onUpdate("theme", e.target.value)}
	>
		<sl-option value="lumen">Lumen</sl-option>
		<sl-option value="spacelab">Spacelab</sl-option>
		<sl-option value="superhero">Superhero</sl-option>
		<sl-option value="dark">Dark</sl-option>
	</sl-select>

	<!-- Knowledge Graph Section -->
	<h3 class="mt-6 text-lg font-semibold">Knowledge Graph</h3>
	<sl-input
		label="Remote URL"
		value={role?.kg?.automata_path?.Remote ?? ""}
		on:sl-input={(e) => updateKGField("Remote", e.target.value)}
	/>
	<sl-input
		label="Local Input Type"
		value={role?.kg?.knowledge_graph_local?.input_type ?? ""}
		on:sl-input={(e) => updateKGField("input_type", e.target.value)}
	/>
	<sl-input
		label="Local Path"
		value={role?.kg?.knowledge_graph_local?.path ?? ""}
		on:sl-input={(e) => updateKGField("local_path", e.target.value)}
	/>

	<sl-checkbox
		checked={role?.kg?.public ?? false}
		on:sl-change={(e) => updateKGField("public", e.target.checked)}
		>Public</sl-checkbox
	>
	<sl-checkbox
		checked={role?.kg?.publish ?? false}
		on:sl-change={(e) => updateKGField("publish", e.target.checked)}
		>Publish</sl-checkbox
	>

	<!-- Haystacks -->
	<h3 class="mt-6 text-lg font-semibold">Haystacks</h3>
	{#each role?.haystacks as haystack, i}
		<div class="space-y-2 rounded-md border bg-gray-50 p-4">
			<sl-input
				label="Path"
				value={haystack?.path}
				on:sl-input={(e) => updateHaystack(i, "path", e.target.value)}
			/>
			<sl-input
				label="Service"
				value={haystack?.service}
				on:sl-input={(e) =>
					updateHaystack(i, "service", e.target.value)}
			/>
		</div>
	{/each}

	<!-- Save Button -->
	<div class="pt-4">
		<sl-button variant="primary" on:click={handleSave} loading={saving}>
			{saving ? "Saving..." : "Update Role"}
		</sl-button>
	</div>
</div>
