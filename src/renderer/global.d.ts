export interface IHeader {
  key: string;
  value: string;
}

export interface IServer {
  id: number;
  name: string;
  port: number;
  isRunning: boolean;
  isLoading: boolean;
  endpoints: Array<IEndpoint>;
  headers: Array<IHeader>;
}

export interface IEndpoint {
  id: number;
  type: string;
  route: string;
  responseType: "text" | "json" | "js" | "html";
  responseCode: string;
  response: string;
  isActive: boolean;
  headers: Array<IHeader>;
}
