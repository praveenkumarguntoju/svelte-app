import { Agent, Store } from '@tomic/react';

export const store = new Store({
  serverUrl: 'https://atomicdata.dev',
});

// OPTIONAL: Auth with write access
const privateKey = 'XSX9t7emBIzwtXtiAtY/E4dtJJtrxWNjtFeX2mziP6A=';
const agentURL =
  'https://atomicdata.dev/agents/rk+Yh85Z1S0oVzhbZcK4RczJTPXa9/dtAMDycsSdaTE=';

const agent = new Agent(privateKey, agentURL);
store.setAgent(agent);

console.log(agent.getPublicKey());

// Debug use only
// @ts-ignore
if (typeof window !== 'undefined') window.store = store;

