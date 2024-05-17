import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { dialog } from 'electron'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')
const DIST = path.join(process.env.APP_ROOT, 'dist')
process.env.APP_ASSETS = process.env.VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'src/public') : DIST

let win: BrowserWindow | null

function createWindow() {
    win = new BrowserWindow({
        icon: path.join(process.env.APP_ASSETS, process.platform === 'win32' ? 'electron-vite.ico' : 'electron-vite.svg'),
        webPreferences: {
            sandbox: false,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.mjs'),
        },
    })

    win.webContents.once('did-finish-load', () => {
        const noMsgTimeout = setTimeout(() => {
            dialog.showErrorBox('Main <-> Renderer communication failed', 'Check that preloader is configured and loaded correctly')
        }, 1000)
        ipcMain.once('renderer-process-message', () => { clearTimeout(noMsgTimeout) })
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        void win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        void win.loadFile(path.join(DIST, 'index.html'))
    }
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        win = null
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

void app.whenReady().then(createWindow)
