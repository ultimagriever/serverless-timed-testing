import RequireAuth from '../hoc/RequireAuth';

import Index from '../components/Index';
import Login from '../components/Login';
import Logout from '../components/Logout';
import StudentDashboard from '../components/student/Dashboard';

// Admin Routes
import AdminDashboard from '../components/admin/Dashboard';
import AdminTests from '../components/admin/tests/ListTests';
import NewTest from '../components/admin/tests/NewTest';
import EditTest from '../components/admin/tests/EditTest';
import ViewTest from '../components/admin/tests/ViewTest';
import NewDomain from '../components/admin/tests/domains/NewDomain';
import EditDomain from '../components/admin/tests/domains/EditDomain';

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
    path: '/admin/tests/:id/edit',
    component: RequireAuth(EditTest)
  },
  {
    path: '/admin/tests/:id',
    component: RequireAuth(ViewTest)
  },
  {
    path: '/admin/tests/:id/domains/new',
    component: RequireAuth(NewDomain)
  },
  {
    path: '/admin/tests/:id/domains/:domainId/edit',
    component: RequireAuth(EditDomain)
  },
  {
    path: '/student/dashboard',
    component: RequireAuth(StudentDashboard)
  }
];

export default routes.map(route => ({ ...route, exact: true }));
