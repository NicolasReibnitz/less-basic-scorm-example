import fs from 'fs-extra/esm';
import klawSync from 'klaw-sync';
import path from 'node:path';
import { defineConfig } from 'vite';
import { zip } from 'zip-a-folder';

const paths = {
	dir: path.resolve(__dirname, './'),
	dist: path.resolve(__dirname, './dist'),
	distSCORM: path.resolve(__dirname, './dist-scorm'),
	dist12: path.resolve(__dirname, './dist-scorm/scorm-1.2'),
	dist3rd: path.resolve(__dirname, './dist-scorm/scorm-2004-3rd'),
	dist4th: path.resolve(__dirname, './dist-scorm/scorm-2004-4th'),
	templates: path.resolve(__dirname, './_scorm-templates')
};

process.env.BROWSER = 'google chrome';

export default defineConfig(({ command }) => ({
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
	},
	plugins: [
		{
			name: 'build-index',
			async closeBundle() {
				console.log('\n\nBuilding SCORM packages...\n\n');
				deleteDSStoreFiles();

				fs.emptyDirSync(paths.distSCORM);
				fs.copySync(paths.dist, paths.dist12);
				fs.copySync(paths.dist, paths.dist3rd);
				fs.copySync(paths.dist, paths.dist4th);
				fs.copySync(paths.templates, paths.distSCORM);

				await zip(paths.dist12, paths.dist12 + '.zip');
				await zip(paths.dist3rd, paths.dist3rd + '.zip');
				await zip(paths.dist4th, paths.dist4th + '.zip');

				console.log('DONE!\n\nThe built SCORM packages can be found here:\n\n', paths.distSCORM, '\n\n');
			}
		}
	]
}));

function deleteDSStoreFiles() {
	const files = klawSync(paths.dir, { nodir: true });
	files.forEach(file => {
		if (file.path.endsWith('.DS_Store')) {
			console.log('file: ', file.path);
			fs.removeSync(file.path);
		}
	});
}
