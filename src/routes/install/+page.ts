import { base } from '$app/paths';
import type { PageLoad } from './$types';

export type Installers = Record<string, { file: string; version: string; core: string }>;

// 事前生成のときに static/install/installers.json を読む (scripts/build-installers.mjs が作る)
export const load: PageLoad = async ({ fetch }) => {
	try {
		const res = await fetch(`${base}/install/installers.json`);
		if (!res.ok) return { installers: {} as Installers };
		return { installers: (await res.json()) as Installers };
	} catch {
		return { installers: {} as Installers };
	}
};
