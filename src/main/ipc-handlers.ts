import { dialog, ipcMain } from 'electron';
import { existsSync, readFileSync, readdir, writeFileSync } from 'fs';

export function registerApiClientFileSystemIpcHandlers(
  mainWindow: Electron.BrowserWindow | null,
) {
  ipcMain.on('open-root-dir-selector', async (event, _) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow!, {
      properties: ['openDirectory'],
    });

    if (canceled || !filePaths[0]) {
      return;
    }

    event.reply('open-root-dir-selector', filePaths[0]);
  });

  ipcMain.on('check-if-root-dir-exists', async (event, args) => {
    const exists = existsSync(args);

    event.reply('check-if-root-dir-exists', exists);
  });
}

export function registerApiClientIpcHandlers() {
  ipcMain.on('send-api-request', async (event, args) => {
    const headersObj: Record<string, string> = {};
    const paramsObj: Record<string, string> = {};
    args.headers.map((header: { key: string; value: string }) => {
      headersObj[header.key] = header.value;
    });
    args.params.map((param: { key: string; value: string }) => {
      paramsObj[param.key] = param.value;
    });
    const reqUrl = `${args.reqUrl}${new URLSearchParams(paramsObj)}`;
    const reqObj: RequestInit = {
      headers: headersObj,
      body:
        !['get', 'head'].includes(args.reqType.toLowerCase()) && args.body
          ? args.body
          : null,
      method: args.reqType,
      credentials: 'include',
    };

    try {
      const resp = await fetch(reqUrl, reqObj);

      const headers: Record<string, string> = {};
      const cookies: Record<string, string> = {};
      resp.headers.forEach((value, key) => {
        if (key === 'set-cookie') {
          const cookie = value.split(';')[0];
          const [cookieKey, cookieValue] = cookie.split('=');
          cookies[cookieKey] = cookieValue;
        }
        headers[key] = value;
      });

      let responseData = null;
      const contentType = resp.headers.get('Content-Type');

      if (contentType?.includes('application/json')) {
        responseData = await resp.json();
      } else if (contentType?.includes('text/html')) {
        responseData = await resp.text();
      }

      const eventReplyObj = {
        responseData: responseData,
        responseHeaders: headers,
        responseCookies: cookies,
        responseCode: resp.status,
        responseStatusText: resp.statusText,
        requestUrl: args.reqUrl,
      };

      event.reply('send-api-request', eventReplyObj);
    } catch (err: any) {
      const eventReplyObj = {
        responseData: null,
        responseHeaders: {},
        responseCookies: {},
        responseCode: null,
        responseStatusText: err.message,
        requestUrl: args.reqUrl,
      };

      event.reply('send-api-request', eventReplyObj);
    }
  });
}
