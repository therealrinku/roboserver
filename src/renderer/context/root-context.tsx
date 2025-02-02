import { PropsWithChildren, createContext, useEffect, useState } from 'react';

interface IRootContext {
  rootDir: string | null;
}

export const RootContext = createContext<IRootContext>({ rootDir: null });

export function RootContextProvider({ children }: PropsWithChildren) {
  const [rootDir, setRootDir] = useState<string | null>(null);

  useEffect(() => {
    const savedRootDir = window.localStorage.getItem('rootDir');
    if (!savedRootDir) {
      return;
    }

    window.electron.ipcRenderer.sendMessage(
      'check-if-root-dir-exists',
      savedRootDir,
    );

    window.electron.ipcRenderer.once('check-if-root-dir-exists', (args) => {
      if (!!args) {
        setRootDir(savedRootDir as string);
      }
    });

    window.electron.ipcRenderer.on('open-root-dir-selector', (args) => {
      window.localStorage.setItem('rootDir', args as string);
      setRootDir(args as string);
    });
  }, []);

  return (
    <RootContext.Provider value={{ rootDir }}>{children}</RootContext.Provider>
  );
}
