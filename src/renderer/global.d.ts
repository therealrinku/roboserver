export interface IServer {
  id: number;
  name: string;
  port: number;
  isRunning: boolean;
  isLoading: boolean;
  endpoints: Array<IEndpoint>;
}

export interface IEndpoint {
  id: number;
  type: string;
  route: string;
  response: string;
  isActive: boolean;
}
