export interface IServer {
  id: number;
  name: string;
  port: number;
  isRunning: boolean;
  endpoints: Array<{
    id: number;
    type: string;
    route: string;
    response: object;
    isActive: boolean;
  }>;
}
