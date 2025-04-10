import { store } from '$lib/atomicClient';

const base = 'https://atomicdata.dev/01jrbfg8draxkzypjzv3wjbqvg/defaultontology/property';
const pathProp = 'https://atomicdata.dev/properties/path';
const serviceProp = 'https://atomicdata.dev/01jrbhd45egb6zt0dtz63reqpc';

export async function saveRoleToAtomic(role: any) {
	debugger;
	try {
		// 1. Save top-level Role fields
		if (!role.url) throw new Error('Missing role.url');

		const roleRes = await store.getResource(role.url);

		// await roleRes.set(`${base}/name`, role.name);
		await roleRes.set(`${base}/shortname`, role.shortname);
		await roleRes.set(`${base}/theme`, role.theme);
		await roleRes.set(`${base}/relevance-function`, role.relevance_function);
		await roleRes.save();

		// 2. Save haystacks
		if (Array.isArray(role.haystacks)) {
			for (const hay of role.haystacks) {
				if (!hay.url) continue;
				const hayRes = await store.getResource(hay.url);
				await hayRes.set(pathProp, hay.path);
				await hayRes.set(`${base}/service`, hay.service);
				await hayRes.save();
			}
		}

		// 3. Save knowledge graph
		if (role.kg && role.kg.url) {
			const kgRes = await store.getResource(role.kg.url);
			await kgRes.set(`${base}/public`, role.kg.public);
			await kgRes.set(`${base}/publish`, role.kg.publish);

			// Save automata
			if (role.kg.automata_path?.url) {
				const autoRes = await store.getResource(role.kg.automata_path.url);
				await autoRes.set(`${base}/remote`, role.kg.automata_path.Remote);
				await autoRes.save();
			}

			// Save knowledge_graph_local
			if (role.kg.knowledge_graph_local?.url) {
				const localRes = await store.getResource(role.kg.knowledge_graph_local.url);
				await localRes.set(`${base}/input-type`, role.kg.knowledge_graph_local.input_type);
				await localRes.set(pathProp, role.kg.knowledge_graph_local.path);
				await localRes.save();
			}

			await kgRes.save();
		}

		console.log(`✅ Role "${role.name}" saved successfully`);
		return true;
	} catch (err) {
		console.error('❌ Failed to save role:', err);
		return false;
	}
}