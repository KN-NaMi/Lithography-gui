import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openNewWindow: () => ipcRenderer.send('open-new-window'), 
});