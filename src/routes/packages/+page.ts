import { base } from '$app/paths';
import type { PageLoad } from './$types';

export type VersionEntry = {
	name: string;
	version: string;
	displayName?: string;
	description?: string;
	url?: string;
	zipSHA256?: string;
	vpmDependencies?: Record<string, string>;
};

export type Listing = {
	name: string;
	id: string;
	url: string;
	packages: Record<string, { versions: Record<string, VersionEntry> }>;
};

// 事前生成のときに static/vpm/index.json を読む (scripts/build-listing.mjs が作る)
export const load: PageLoad = async ({ fetch }) => {
	try {
		const res = await fetch(`${base}/vpm/index.json`);
		if (!res.ok) return { listing: null as Listing | null };
		return { listing: (await res.json()) as Listing };
	} catch {
		return { listing: null as Listing | null };
	}
};
