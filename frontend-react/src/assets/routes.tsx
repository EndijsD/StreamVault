import { createBrowserRouter } from 'react-router'
import NotFound from '../pages/NotFound'
import Landing from '../pages/Landing'
import Layout from '../components/Layout'
import Login from '../pages/Login'
import Library from '../pages/Library'
import ProtectedRoute from '../components/ProtectedRoute'
import RedirectRoute from '../components/RedirectRoute'
import Register from '../pages/Register'

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
        element: <RedirectRoute />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
        ],
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'library',
            element: <Library />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
