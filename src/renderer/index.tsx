import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
window.ipcRenderer.on('main-process-message', (_event, _message) => {
    window.ipcRenderer.send('renderer-process-message')
})