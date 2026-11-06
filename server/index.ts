import { Router } from 'express';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import systemRoutes from './routes/system.routes';

const serverRouter = Router();

// Subrotas da API do Backend
serverRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Ternatio BJJ API' });
});
serverRouter.use('/auth', authRoutes);
serverRouter.use('/users', usersRoutes);
serverRouter.use('/system', systemRoutes);

export default serverRouter;
