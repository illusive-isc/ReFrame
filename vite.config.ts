import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// 完全な静的サイトとして build/ に書き出す (そのままホスティングに置く)
			adapter: adapter({
				pages: 'build',
				assets: 'build',
				fallback: undefined,
				precompress: false,
				strict: true
			}),
			paths: {
				// サブパスで公開するときは環境変数 BASE_PATH (例: /ReFrame) を渡す
				base: (process.env.BASE_PATH ?? '') as '' | `/${string}`
			},
			prerender: {
				handleHttpError: 'warn'
			}
		})
	]
});
