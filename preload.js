const { ipcRenderer } = require("electron");

window.addEventListener('DOMContentLoaded', () => {

  document.getElementById("b-0").addEventListener('click', () => {
    ipcRenderer.send('load-url', 'https://youtube.com')
  })
  
  document.getElementById("b-1").addEventListener('click', () => {
    ipcRenderer.send('load-url', 'https://google.com')
  })
  
  document.getElementById("b-2").addEventListener('click', () => {
    ipcRenderer.send('load-url', 'https://electronjs.org')
  })

  document.getElementById("back").addEventListener('click', () => {
    ipcRenderer.send('v-nav', 'back')
  })

  document.getElementById("forward").addEventListener('click', () => {
    ipcRenderer.send('v-nav', 'forward')
  })
})