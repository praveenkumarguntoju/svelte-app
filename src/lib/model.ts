export interface Haystack {
	path: string;
	service: string;
}

export interface KnowledgeGraph {
	automata_path?: { Remote: string };
	knowledge_graph_local?: {
		input_type: string;
		path: string;
	};
	public?: boolean;
	publish?: boolean;
}

export interface Role {
	shortname: string;
	name: string;
	relevance_function: string;
	theme: string;
	kg: KnowledgeGraph | null;
	haystacks: Haystack[];
}

export interface ServerConfig {
	id: string;
	global_shortcut: string;
	default_role: string;
	selected_role: string;
	roles: Record<string, Role>;
}