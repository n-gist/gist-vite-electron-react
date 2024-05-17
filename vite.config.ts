import { rmSync } from 'node:fs'
import { defineConfig, type LogLevel } from 'vite'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

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
        ]
    }
})