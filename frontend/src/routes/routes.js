import Index from '../components/Index';
import Login from '../components/Login';

const routes = [
  {
    path: '/',
    component: Index
  },
  {
    path: '/login',
    component: Login
  }
];

export default routes.map(route => ({ ...route, exact: true }));
