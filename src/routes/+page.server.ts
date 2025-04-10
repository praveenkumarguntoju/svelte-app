export const load = async ({ platform }) => {
	const env = platform?.env || process.env;

	const PRIVATE_KEY = env.PRIVATE_KEY;
	const AGENT_URL = env.AGENT_URL;

    console.log('✅ PRIVATE_KEY:', PRIVATE_KEY);
	console.log('✅ AGENT_URL:', AGENT_URL);


	if (!PRIVATE_KEY || !AGENT_URL) {
		throw new Error('Missing Cloudflare secrets');
	}

	// const { store } = createStore(PRIVATE_KEY, AGENT_URL);
};
