const { app, BrowserWindow, protocol, net } = require('electron');
const path = require('path');

// Must be called before app.whenReady()
protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    standard: true,      // enables proper origin/localStorage
    secure: true,        // treats it like https
    supportFetchAPI: true
  }
}]);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
    }
  });
  win.loadURL('app:///index.html');
};

app.whenReady().then(() => {
  protocol.handle('app', (request) => {
    let p = request.url.slice('app://'.length).replace(/^[^/]*/, '');
    p = p.split('?')[0].split('#')[0];
    if (!p || p === '/') p = '/index.html';
    if (!path.extname(p)) p += '.html';
    return net.fetch('file://' + path.join(__dirname, p));
  });

  createWindow();
});