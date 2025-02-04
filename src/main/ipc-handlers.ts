import { ipcMain } from 'electron';
import express from 'express';
import { readFile } from 'fs';
import { IncomingMessage, Server, ServerResponse } from 'http';
import path from 'path';
import { isValidJson } from './util';

export function registerIpcHandlers(mainWindow: Electron.BrowserWindow | null) {
  const expressServers: Record<
    string, //port number string
    Server<typeof IncomingMessage, typeof ServerResponse>
  > = {};

  ipcMain.on('start-server', (event, server) => {
    const { port, name, endpoints } = server;

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

    for (let endpoint of endpoints) {
      //@ts-expect-error FIXME
      app[endpoint.type](endpoint.route, (req, res) => {
        const isJson = isValidJson(endpoint.response);
        if (isJson) {
          res.status(200).json(JSON.parse(endpoint.response));
        } else {
          res.status(200).send(endpoint.response);
        }
      });
    }

    app.get('/', (req, res) => {
      const routeDivs = endpoints
        .map(
          //@ts-expect-error FIXME
          (endpoint) => `
    <div class="flex justify-center p-2 border rounded w-[85vw]  max-w-[200px]">
      <a href="http://localhost:${server.port}${endpoint.route}">${endpoint.route}</p>
    </div>
  `,
        )
        .join('');

      const html = `
        <html>
          <head>    
             <title>Initiate</title>
             <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
          </head>

          <body>
             <div class="flex flex-col gap-2 items-center justify-center h-screen w-screen text-xs">
               <img class="h-16 w-16" src="https://camo.githubusercontent.com/e2d13db311bf5ab7d5fde9c7e27ee3af97785709727b0a69fabe7e45386a9884/68747470733a2f2f63646e2d69636f6e732d706e672e666c617469636f6e2e636f6d2f3132382f323237392f323237393231322e706e67"/>
                <p>initiate</p>

                <div class="flex flex-col gap-5">
                  <p class="font-bold">routes</p>
                  ${routeDivs}
                </div>
             </div>
          </body>
        </html
      `;
      res.send(html);
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
