const { app, BrowserWindow, protocol, net, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

Menu.setApplicationMenu(null);

protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    standard: true,
    secure: true,
    supportFetchAPI: true
  }
}]);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: nativeImage.createFromPath(path.join(__dirname, 'files/icon.png')),
    webPreferences: {
      contextIsolation: false,
      //nodeIntegration: true,
    }
  });
  win.loadURL('app:///index.html');
};

app.whenReady().then(() => {
  protocol.handle('app', (request) => {
    let p = request.url.slice('app://'.length).replace(/^[^/]*/, '');
    p = p.split('?')[0].split('#')[0];
    if (!p || p === '/') p = '/index.html';

    let fullPath = path.join(__dirname, p);

    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
      fullPath = path.join(fullPath, 'index.html');
    } else if (!path.extname(p)) {
      fullPath += '.html';
    }

    return net.fetch('file://' + fullPath);
  });

  app.on('web-contents-created', (event, contents) => {
    contents.setWindowOpenHandler(({ url }) => {
      BrowserWindow.fromWebContents(contents)?.loadURL(url);
      return { action: 'deny' };
    });

    contents.on('did-finish-load', () => {
      contents.executeJavaScript(`
        new Promise(resolve => {
          const check = () => {
            const href = document.querySelector('link[rel="icon"]')?.href || '';
            if (href) return resolve(href);
            setTimeout(check, 100);
          };
          check();
        })
      `).then(href => {
        if (!href) return;
        const win = BrowserWindow.fromWebContents(contents);
        if (!win) return;
        const localPath = href.startsWith('app://')
          ? path.join(__dirname, href.slice('app://'.length).replace(/^[^/]*/, ''))
          : path.join(__dirname, 'files/icon.png');
        const icon = nativeImage.createFromPath(localPath);
        if (!icon.isEmpty()) win.setIcon(icon);
      });
    });
  });

  createWindow();
});