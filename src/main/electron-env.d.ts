/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    APP_ROOT: string
    APP_ASSETS: string
  }
}

interface Window {
  ipcRenderer: import('electron').IpcRenderer
}
