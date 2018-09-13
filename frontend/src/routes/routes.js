import Index from '../components/Index';

const routes = [
  {
    path: '/',
    component: Index
  }
];

export default routes.map(route => ({ ...route, exact: true }));
