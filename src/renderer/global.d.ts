export interface IServer {
  id: number;
  name: string;
  port: number;
  isRunning: boolean;
  endpoints: Array<IEndpoint>;
}

export interface IEndpoint {
  id: number;
  type: string;
  route: string;
  response: object;
  isActive: boolean;
}
