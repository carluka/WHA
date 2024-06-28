import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import ProtectedRoute from './ProtectedRoute';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/zaposleni/Zaposleni')));
const PageNotFound = Loadable(lazy(() => import('pages/components-overview/PageNotFound')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <AuthLogin />
    },
    {
      path: 'register',
      element: <AuthRegister />
    },
    {
      path: '*',
      element: <ProtectedRoute element={<PageNotFound />} />
    }
  ]
};

export default LoginRoutes;
