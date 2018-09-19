import RequireAuth from '../hoc/RequireAuth';

import Index from '../components/Index';
import Login from '../components/Login';
import Logout from '../components/Logout';
import AdminDashboard from '../components/admin/Dashboard';

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
  },
  {
    path: '/admin/dashboard',
    component: RequireAuth(AdminDashboard)
  }
];

export default routes.map(route => ({ ...route, exact: true }));
