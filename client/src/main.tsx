import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { CartProvider } from './contexts/CartContext';
import RoutesConfig from './routes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <CartProvider>
          <RoutesConfig />
        </CartProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
