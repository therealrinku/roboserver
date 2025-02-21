/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { IHeader, IServer } from '../renderer/global';

export function isValidServerJson(fileContent: string) {
  function isHeadersValid(headers: IHeader[]) {
    if (headers.length === 0) {
      return true;
    }

    for (const header of headers) {
      if (typeof header.key !== 'string' || typeof header.value !== 'string') {
        return false;
      }
    }

    return true;
  }

  try {
    const server = JSON.parse(fileContent) as IServer;
    if (
      !server.id ||
      !server.port ||
      !server.name ||
      server.isLoading === undefined ||
      server.isRunning === undefined ||
      !Array.isArray(server.endpoints) ||
      !Array.isArray(server.headers)
    ) {
      return false;
    }

    if (server.endpoints.length > 0) {
      for (const endpoint of server.endpoints) {
        const validHeaders = isHeadersValid(endpoint.headers);
        if (
          !endpoint.id ||
          !endpoint.type ||
          !endpoint.route ||
          !endpoint.responseCode ||
          !endpoint.response ||
          endpoint.isActive === undefined ||
          !validHeaders
        ) {
          return false;
        }
      }
    }

    return isHeadersValid(server.headers) && true;
  } catch (err) {
    return false;
  }
}

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function isValidJson(text: string) {
  try {
    JSON.parse(text);
    return true;
  } catch (err) {
    return false;
  }
}

export function generateExpressServerHomepageHtml(server: IServer) {
  const { endpoints } = server;

  const routeDivs = endpoints
    .filter((endpoint) => endpoint.isActive)
    .map(
      (endpoint) => `
      <a 
        class="${endpoint.type !== 'get' && 'pointer-events-none'} flex items-center gap-2 py-[7px] hover:underline bg-gray-100 pl-2 w-[85vw] max-w-[500px]" href="http://localhost:${server.port}${endpoint.route}"
      >
      <p class="font-bold bg-gray-500 p-1 text-white">${endpoint.type}</p>
      <p>${endpoint.route}</p>
    </a>
  `,
    )
    .join('');

  const html = `
        <html>
          <head>    
             <title>roboserver</title>
             <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
          </head>

          <body>
             <div class="flex flex-col gap-2 items-center justify-center h-screen w-screen text-xs">
             <div class="fixed left-5 bottom-5 flex items-center gap-2">
                <p class="font-bold">roboserver v0.0.1</p>
                <a class="hover:underline" href="https://github.com/therealrinku/roboserver.git" target="_blank">Github</a>
             </div>

                <div class="flex flex-col gap-2 mt-5 ${endpoints.length === 0 && 'hidden'}">
                  <p class="font-bold border-b pb-2 border-gray-300">${server.name} Routes</p>
                  <div class="h-[500px] overflow-y-auto flex flex-col gap-2">${routeDivs}</div>
                </div>
                
                <p class="${endpoints.length > 0 && 'hidden'} mt-5">No any routes added yet.</p>                
             </div>
          </body>
        </html
      `;

  return html;
}
