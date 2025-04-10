// src/lib/atomicClient.ts
import { Agent, Store } from '@tomic/react';

export function createStore(privateKey: string, agentURL: string) {
  const store = new Store({ serverUrl: 'https://atomicdata.dev' });

  const agent = new Agent(privateKey, agentURL);
  store.setAgent(agent);
  // Debug only: expose on window for dev
  // @ts-ignore
  if (typeof window !== 'undefined') window.store = store;

  return { store, agent };
}

