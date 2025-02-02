export interface IServer {
  id: number;
  name: string;
  endpoints: Array<{
    id: number;
    type: string;
    route: string;
    response: string; //stringified json
  }>;
}
