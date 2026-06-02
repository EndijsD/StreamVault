import { createBrowserRouter } from 'react-router';
import NotFound from '../pages/NotFound';
import Landing from '../pages/Landing';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Library from '../pages/Library';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'library',
        element: <Library />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
