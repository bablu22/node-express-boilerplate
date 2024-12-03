import authRoutes from '@/modules/Auth/auth.routes';
import sessionRoutes from '@/modules/Session/session.routes';
import { Router } from 'express';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    routes: authRoutes,
  },
  {
    path: '/session',
    routes: sessionRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.routes);
});

export default router;
