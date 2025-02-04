import { ipcMain } from 'electron';
import express from 'express';
import { IncomingMessage, Server, ServerResponse } from 'http';

export function registerIpcHandlers(mainWindow: Electron.BrowserWindow | null) {
  const expressServers: Record<
    string,
    Server<typeof IncomingMessage, typeof ServerResponse>
  > = {};

  ipcMain.on('start-server', (event, server) => {
    const { port } = server;

    if (!port) {
      event.reply('start-server', {
        error: true,
        message: 'Port error.',
        server,
      });
      return;
    }

    const app = express();

    if (expressServers[port]) {
      event.reply('start-server', {
        success: true,
        message: `Server is already running at port ${server.port}`,
        server,
      });
      return;
    }

    app.get('/ping', (req, res) => {
      res.json({ success: true, message: 'pong' });
    });

    const httpServer = app.listen(Number(port), () => {
      console.log(`server running at port ${port}`);
    });

    httpServer.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        event.reply('start-server', {
          success: true,
          message: `Server is already running at port ${server.port}`,
          server,
        });
        return;
      }

      event.reply('start-server', {
        success: true,
        message: `Something went wrong while running the server at port ${server.port}. Please try reloading the app.`,
        server,
      });

      return;
    });

    expressServers[port] = httpServer;
    event.reply('start-server', { sucess: true, server });
  });

  ipcMain.on('stop-server', (event, server) => {
    const { port } = server;

    if (!expressServers[port]) {
      event.reply('stop-server', {
        error: true,
        message: 'Server is not running. So it cannot be stopped.',
        server,
      });
      return;
    }

    expressServers[port].close();
    delete expressServers[port];
    event.reply('stop-server', { success: true, server });
  });
}
