import { defineConfig } from 'vite';

process.env.BROWSER = 'google chrome canary';

export default defineConfig({
	root: './src',
	base: './',
	publicDir: '../public',
	build: {
		outDir: '../dist',
		copyPublicDir: true,
		rollupOptions: {
			output: { assetFileNames: 'assets/[name][extname]', entryFileNames: 'assets/[name].js' }
		}
	},
	server: {
		open: '/index.html'
	}
});
