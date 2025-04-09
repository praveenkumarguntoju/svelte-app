// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

import { store } from '$lib/atomicClient';

export async function load() {
	const subject = 'https://atomicdata.dev/01jrbnssgaajse2s37j2tdpaah';
	const base = 'https://atomicdata.dev/01jrbfg8draxkzypjzv3wjbqvg/defaultontology/property';

	const pathProp = 'https://atomicdata.dev/properties/path';
	const serviceProp = 'https://atomicdata.dev/01jrbhd45egb6zt0dtz63reqpc';

	// Fetch ServerConfig
	const resource = await store.getResource(subject);
	const serverConfig = {
		id: resource.get(`${base}/id`),
		global_shortcut: resource.get(`${base}/global-shortcut`),
		default_role: resource.get(`${base}/default-role`),
		selected_role: resource.get(`${base}/selected-role`),
		roles: {}
	};

	const roleUrls = await resource.getArray(`${base}/roles`);

	const roles = await Promise.all(
		roleUrls.map(async (url: any) => {
			const roleRes = await store.getResource(url);

			// Fetch haystack array
			const haystackUrls = await roleRes.getArray(`${base}/haystacks`);
			const haystacks = await Promise.all(
				haystackUrls.map(async (hurl: any) => {
					const hay = await store.getResource(hurl);
					return {
						url: hurl,
						path: hay.get(pathProp),
						service: hay.get(serviceProp)
					};
				})
			);

			// Fetch knowledge graph (kg)
			let kg = null;
			const kgUrl: string = roleRes.get(`${base}/kg`);
			if (kgUrl) {
				const kgRes = await store.getResource(kgUrl);
				const automataUrl: string = kgRes.get(`${base}/automata-path`);
				const localKGUrl: string = kgRes.get(`${base}/knowledge-graph-local`);

				let automata_path = null;
				let knowledge_graph_local = null;

				if (automataUrl) {
					const autoRes = await store.getResource(automataUrl);
					automata_path = {
						url: automataUrl,
						Remote: autoRes.get(`${base}/remote`)
					};
				}

				if (localKGUrl) {
					const localRes = await store.getResource(localKGUrl);
					knowledge_graph_local = {
						url: localKGUrl,
						input_type: localRes.get(`${base}/input-type`),
						path: localRes.get(pathProp)
					};
				}

				kg = {
					url: kgUrl,
					public: kgRes.get(`${base}/public`),
					publish: kgRes.get(`${base}/publish`),
					automata_path: automata_path,
					knowledge_graph_local
				};
			}

			// Build and return role with all needed URLs
			return {
				url, // role resource URL
				name: roleRes.get(`${base}/shortname`),
				shortname: roleRes.get(`${base}/shortname`),
				theme: roleRes.get(`${base}/theme`),
				relevance_function: roleRes.get(`${base}/relevance-function`),
				haystacks,
				kg
			};
		})
	);

	// Convert roles array to Record<string, Role>
	const roleobj: Record<string, any> = {};
	for (const obj of roles) {
        let name:any = obj['name'] || '';
		roleobj[name] = obj;
	}

	serverConfig.roles = roleobj;

	return {
		serverConfig
	};
}

