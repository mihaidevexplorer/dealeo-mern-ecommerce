// dashboard/src/main.jsx
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index';
import { Toaster } from 'react-hot-toast';
import { getRoutes } from './router/routes';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([getRoutes()]);

root.render(
  <Provider store={store}>
    <Suspense>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          position: 'top-right',
          style: { background: '#283046', color: 'white' },
        }}
      />
    </Suspense>
  </Provider>
);

