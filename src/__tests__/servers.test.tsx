import { render, screen } from '@testing-library/react';
import Servers from '../renderer/pages/servers';
import App from '../renderer/app';

describe('server starts on given port', () => {
  it('should start the server on given port', () => {
    render(<App/>);
    const startServerButton = screen.getAllByTestId('start-stop-server-button');
  });
});

describe('server stops correctly', () => {
  //todo
});
