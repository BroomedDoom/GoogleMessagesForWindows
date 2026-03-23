const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('messagesApp', {
  platform: process.platform
});
