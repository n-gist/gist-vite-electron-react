import { rmSync } from 'node:fs'
import { defineConfig, type LogLevel, type ViteDevServer, type PluginOption } from 'vite'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import { join } from 'path'

const entryHtml = '/src/renderer/index.html'

const resolveMainPage: () => PluginOption = () => ({
    name: 'redirect-main-page',
    configureServer(server: ViteDevServer) {
        server.middlewares.use((req, _res, next) => {
            if (req.originalUrl === '/' || req.originalUrl === '/index.html') req.url = entryHtml
            next()
        })
    }
})

export default defineConfig(({ command }) => {
    
    const isBuild = command === 'build'
    const debug = !!process.env.DEBUG
    const debug_sourcemaps = !!process.env.DEBUG_SOURCEMAPS
    const logLevel: LogLevel = 'warn'
    const outDir = 'dist-electron'
    const entryMain = 'src/main/main.ts'
    const inputPreload = 'src/main/preload.ts'
    const publicDir = 'src/public'
    
    rmSync(outDir, { recursive: true, force: true })
    
    return {
        publicDir,
        logLevel,
        plugins: [
            resolveMainPage(),
            react(),
            electron({
                main: {
                    entry: entryMain,
                    vite: {
                        logLevel,
                        build: {
                            sourcemap: debug_sourcemaps,
                            minify: isBuild,
                            outDir
                        }
                    },
                    onstart({ startup }) {
                        const args = [
                            '.',
                            '--no-sandbox'
                        ]
                        if (debug) {
                            args.push('--inspect=5858')
                            args.push('--remote-debugging-port=9229')
                        }
                        if (debug_sourcemaps) args.push('--sourcemap')
                        void startup(args)
                    }
                },
                preload: {
                    input: inputPreload,
                    vite: {
                        logLevel,
                        build: {
                            sourcemap: debug_sourcemaps ? 'inline' : undefined,
                            minify: isBuild,
                            outDir
                        }
                    }
                },
                renderer: {},
            }),
        ],
        build: {
            rollupOptions: {
                input: {
                    main: join(__dirname, entryHtml)
                }
            }
        }
    }
})