import { createBrowserRouter } from 'react-router'
import NotFound from '../pages/NotFound'
import Landing from '../pages/Landing'
import Layout from '../components/Layout'
import Login from '../pages/Login'

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
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
