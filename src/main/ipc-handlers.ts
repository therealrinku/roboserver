import { ipcMain } from 'electron';
import express from 'express';
import { IncomingMessage, Server, ServerResponse } from 'http';

export function registerIpcHandlers(mainWindow: Electron.BrowserWindow | null) {
  let expressServers: Record<
    string,
    Server<typeof IncomingMessage, typeof ServerResponse>
  >;

  ipcMain.on('start-server', (event, args) => {
    if (!args.port) {
      event.reply('start-server', { error: true, message: 'Port error.' });
      return;
    }

    const app = express();

    if (expressServers[args.port]) {
      event.reply('start-server', {
        error: true,
        message: `Server is already running at port ${args.port}`,
      });
      return;
    }

    const httpServer = app.listen(Number(args.port), () => {
      console.log(`server running at port ${args.port}`);
    });

    expressServers[args.port] = httpServer;
    event.reply('start-server', { success: true });
  });

  ipcMain.on('stop-server', (event, args) => {
    if (!expressServers[args.port]) {
      event.reply('stop-server', {
        error: true,
        message: 'Server is not running. So it cannot be stopped.',
      });
      return;
    }

    expressServers[args.port].close();
    event.reply('stop-server', { success: true });
  });
}
