import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'

export default defineConfig(() => {
	return {
		root: './src',
		publicDir: '../public',
		base: '/physarum-simulation/',
		build: {
			outDir: '../dist',
		},
		plugins: [glsl()],
		server: {
			host: true,
		},
	}
})
