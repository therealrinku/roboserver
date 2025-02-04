import { ipcMain } from 'electron';
import express from 'express';
import { IncomingMessage, Server, ServerResponse } from 'http';

export function registerIpcHandlers(mainWindow: Electron.BrowserWindow | null) {
  const expressServers: Record<
    string, //port number string
    Server<typeof IncomingMessage, typeof ServerResponse>
  > = {};

  ipcMain.on('start-server', (event, server) => {
    const { port } = server;

    if (!port) {
      event.reply('error-happended', {
        message: 'Port error.',
        server,
      });
      return;
    }

    const app = express();

    if (expressServers[port]) {
      event.reply('error-happened', {
        message: `Server is already running at port ${server.port}`,
        server,
      });
      return;
    }

    app.get('/ping', (req, res) => {
      res.json({ success: true, message: 'pong' });
    });

    const httpServer = app.listen(Number(port), () => {
      expressServers[port] = httpServer;
      console.log(`server running at port ${port}`);
    });

    httpServer.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        event.reply('error-happened', {
          message: `Server is already running at port ${server.port}`,
          server,
        });
        return;
      }

      event.reply('error-happened', {
        message: `Something went wrong while running the server at port ${server.port}. Please try reloading the app.`,
        server,
      });

      return;
    });

    event.reply('start-server', { server });
  });

  ipcMain.on('stop-server', (event, server) => {
    const { port } = server;

    if (!expressServers[port]) {
      event.reply('error-happened', {
        message: 'Server is not running. So it cannot be stopped.',
        server,
      });
      return;
    }

    expressServers[port]?.close((err) => {
      if (err) {
        event.reply('error-happened', {
          message: `Failed to stop the server on port ${server.port}.`,
          server,
        });
      } else {
        delete expressServers[port];
      }
      console.log(`server running at port ${port} has been stopped.`);
      event.reply('stop-server', { server });
    });
  });
}
