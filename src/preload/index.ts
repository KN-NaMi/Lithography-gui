import { contextBridge, ipcRenderer } from 'electron';

// Udostępnij API do renderera
contextBridge.exposeInMainWorld('electronAPI', {
  openNewWindow: () => ipcRenderer.send('open-new-window'), // Wysyła żądanie otwarcia nowego okna
});