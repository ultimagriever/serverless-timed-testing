import RequireAuth from '../hoc/RequireAuth';

import Index from '../components/Index';
import Login from '../components/Login';
import Logout from '../components/Logout';
import StudentDashboard from '../components/student/Dashboard';

// Admin Routes
import AdminDashboard from '../components/admin/Dashboard';
import AdminTests from '../components/admin/tests/ListTests';
import NewTest from '../components/admin/tests/NewTest';

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
  },
  {
    path: '/admin/tests',
    component: RequireAuth(AdminTests)
  },
  {
    path: '/admin/tests/new',
    component: RequireAuth(NewTest)
  },
  {
    path: '/student/dashboard',
    component: RequireAuth(StudentDashboard)
  }
];

export default routes.map(route => ({ ...route, exact: true }));
