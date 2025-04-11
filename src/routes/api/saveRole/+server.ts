import { json } from '@sveltejs/kit';

import { Agent, Store } from '@tomic/react';

export async function POST({ request, platform }) {
    const store = new Store({ serverUrl: 'https://atomicdata.dev' });
	const env = platform?.env || process.env;
	const PRIVATE_KEY = env.PRIVATE_KEY;
	const AGENT_URL = env.AGENT_URL;
    const base = env.BASE_URL
    const pathProp  = env.PATH_PROP

	if (!PRIVATE_KEY || !AGENT_URL) {
		return json({ error: 'Missing secrets' }, { status: 500 });
	}

    const agent = new Agent(PRIVATE_KEY, AGENT_URL);
    store.setAgent(agent);
	const role = await request.json();

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
            return json({ success: true });
        } catch (err) {
            console.error('❌ Failed to save role:', err);
            return json({ success: false });
        }


}