const { contextBridge } = require("electron");
const os = require("os");

// Resolve the machine's primary non-internal IPv4 address (LAN IP).
function getLocalIp() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return undefined;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electron", {
  platform: process.platform,
  // Desktop-only device context (not available in the browser build)
  getDeviceInfo: () => ({
    device_name: os.hostname(),
    local_ip: getLocalIp(),
    os_platform: process.platform,
    os_release: os.release(),
  }),
  // Add any APIs you need here
});
