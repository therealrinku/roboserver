import { ipcMain } from 'electron';
import express from 'express';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { generateExpressServerHomepageHtml, isValidJson } from './util';
import { IServer } from '../renderer/global';

export function registerIpcHandlers(mainWindow: Electron.BrowserWindow | null) {
  const expressServers: Record<
    string, //port number string
    Server<typeof IncomingMessage, typeof ServerResponse>
  > = {};

  //do better implmentation later maybe?
  ipcMain.on('restart-server', (event, server) => {
    const { port } = server as IServer;

    if (!expressServers[port]) {
      return;
    }

    expressServers[port].close((err) => {
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
      ipcMain.emit('start-server', event, server);
    });
  });

  ipcMain.on('start-server', (event, server) => {
    const { port, endpoints, headers: serverHeaders } = server as IServer;

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

    app.get('/', (req, res) => {
      const homepageHtml = generateExpressServerHomepageHtml(server);
      res.send(homepageHtml);
    });

    for (let endpoint of endpoints) {
      if (!endpoint.isActive) {
        continue;
      }
      //@ts-expect-error FIXME
      app[endpoint.type](endpoint.route, (req, res) => {
        for (const serverHeader of serverHeaders) {
          if (!serverHeader.key.trim() || !serverHeader.value.trim()) {
            continue;
          }
          res.set(serverHeader.key, serverHeader.value);
        }

        for (const endpointHeader of endpoint.headers) {
          if (!endpointHeader.key.trim() || !endpointHeader.value.trim()) {
            continue;
          }
          res.set(endpointHeader.key, endpointHeader.value);
        }

        const isJson = isValidJson(endpoint.response);
        if (isJson) {
          res.status(endpoint.responseCode).json(JSON.parse(endpoint.response));
        } else {
          res.status(endpoint.responseCode).send(endpoint.response);
        }
      });
    }

    const httpServer = app.listen(Number(port), () => {
      expressServers[port] = httpServer;
      console.log(`server running at port ${port}`);
      event.reply('start-server', { server });
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
  });

  ipcMain.on('stop-server', (event, server) => {
    const { port } = server as IServer;

    if (!expressServers[port]) {
      event.reply('error-happened', {
        message: 'Server is not running. So it cannot be stopped.',
        server,
      });
      return;
    }

    expressServers[port].close((err) => {
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
