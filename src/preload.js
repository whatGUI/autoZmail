import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ['win-minimize','win-maximize','win-close']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  // receive: (channel, func) => {
  //   let validChannels = ['fromMain']
  //   if (validChannels.includes(channel)) {
  //     // Deliberately strip event as it includes `sender`
  //     ipcRenderer.on(channel, (event, ...args) => func(...args))
  //   }
  // },
  invoke:(channel,data)=>{
    let validChannels = ['get-folder-dir','send-email']
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data)
    }
  }

})