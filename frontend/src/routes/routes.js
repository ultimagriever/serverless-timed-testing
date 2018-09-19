import RequireAuth from '../hoc/RequireAuth';

import Index from '../components/Index';
import Login from '../components/Login';
import Logout from '../components/Logout';

const routes = [
  {
    path: '/',
    component: Index
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/logout',
    component: RequireAuth(Logout)
  }
];

export default routes.map(route => ({ ...route, exact: true }));
